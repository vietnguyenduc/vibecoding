import {
  createError,
  isRetryableError,
  calculateRetryDelay,
  retryWithBackoff,
  normalizeError,
  handleDatabaseError,
  handleImportError,
  batchOperation,
  createErrorBoundary,
  ERROR_CODES,
  defaultRetryConfig,
  AppError,
  RetryConfig,
} from '../errorHandling';
import { ImportError } from '../../types';

describe('Error Handling Utils', () => {
  describe('createError', () => {
    it('creates error with required fields', () => {
      const error = createError('TEST_ERROR', 'Test error message');
      
      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test error message');
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.retryable).toBe(false);
      expect(error.details).toBeUndefined();
    });

    it('creates error with optional fields', () => {
      const details = { field: 'test', value: 'invalid' };
      const error = createError('TEST_ERROR', 'Test error message', details, true);
      
      expect(error.details).toEqual(details);
      expect(error.retryable).toBe(true);
    });

    it('sets timestamp to current time', () => {
      const before = new Date();
      const error = createError('TEST_ERROR', 'Test error message');
      const after = new Date();
      
      expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('isRetryableError', () => {
    it('returns true for retryable errors', () => {
      const error = createError(ERROR_CODES.NETWORK_ERROR, 'Network error', undefined, true);
      expect(isRetryableError(error)).toBe(true);
    });

    it('returns false for non-retryable errors', () => {
      const error = createError(ERROR_CODES.VALIDATION_ERROR, 'Validation error', undefined, false);
      expect(isRetryableError(error)).toBe(false);
    });

    it('returns false for retryable errors not in retryable list', () => {
      const error = createError('CUSTOM_ERROR', 'Custom error', undefined, true);
      expect(isRetryableError(error)).toBe(false);
    });

    it('uses custom retry config', () => {
      const customConfig: RetryConfig = {
        ...defaultRetryConfig,
        retryableErrors: ['CUSTOM_ERROR'],
      };
      
      const error = createError('CUSTOM_ERROR', 'Custom error', undefined, true);
      expect(isRetryableError(error, customConfig)).toBe(true);
    });
  });

  describe('calculateRetryDelay', () => {
    it('calculates exponential backoff correctly', () => {
      expect(calculateRetryDelay(1)).toBe(1000); // baseDelay
      expect(calculateRetryDelay(2)).toBe(2000); // baseDelay * 2
      expect(calculateRetryDelay(3)).toBe(4000); // baseDelay * 4
    });

    it('respects max delay limit', () => {
      const config: RetryConfig = {
        ...defaultRetryConfig,
        maxDelay: 2000,
      };
      
      expect(calculateRetryDelay(3, config)).toBe(2000); // capped at maxDelay
    });

    it('uses custom config values', () => {
      const config: RetryConfig = {
        baseDelay: 500,
        maxDelay: 5000,
        backoffMultiplier: 3,
        maxAttempts: 3,
        retryableErrors: [],
      };
      
      expect(calculateRetryDelay(1, config)).toBe(500);
      expect(calculateRetryDelay(2, config)).toBe(1500); // 500 * 3
    });
  });

  describe('retryWithBackoff', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('succeeds on first attempt', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      
      const result = await retryWithBackoff(operation);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('retries on retryable errors and succeeds', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(createError(ERROR_CODES.NETWORK_ERROR, 'Network error', undefined, true))
        .mockResolvedValueOnce('success');
      
      const onRetry = jest.fn();
      
      const resultPromise = retryWithBackoff(operation, defaultRetryConfig, onRetry);
      
      // Fast-forward through the retry delay
      jest.advanceTimersByTime(1000);
      
      const result = await resultPromise;
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Object), 1000);
    });

    it('fails after max attempts', async () => {
      const error = createError(ERROR_CODES.NETWORK_ERROR, 'Network error', undefined, true);
      const operation = jest.fn().mockRejectedValue(error);
      
      const resultPromise = retryWithBackoff(operation);
      
      // Fast-forward through all retry delays
      jest.advanceTimersByTime(1000 + 2000 + 4000);
      
      await expect(resultPromise).rejects.toEqual(error);
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('does not retry non-retryable errors', async () => {
      const error = createError(ERROR_CODES.VALIDATION_ERROR, 'Validation error', undefined, false);
      const operation = jest.fn().mockRejectedValue(error);
      
      await expect(retryWithBackoff(operation)).rejects.toEqual(error);
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe('normalizeError', () => {
    it('normalizes AppError objects', () => {
      const originalError = createError('TEST_ERROR', 'Test error');
      const normalized = normalizeError(originalError);
      
      expect(normalized).toBe(originalError);
    });

    it('normalizes Error objects', () => {
      const originalError = new Error('Test error');
      const normalized = normalizeError(originalError);
      
      expect(normalized.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
      expect(normalized.message).toBe('Test error');
      expect(normalized.details?.originalError).toBe(originalError);
      expect(normalized.retryable).toBe(false);
    });

    it('normalizes string errors', () => {
      const normalized = normalizeError('String error');
      
      expect(normalized.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
      expect(normalized.message).toBe('String error');
      expect(normalized.details?.originalError).toBe('String error');
      expect(normalized.retryable).toBe(false);
    });

    it('normalizes unknown error types', () => {
      const unknownError = { custom: 'error' };
      const normalized = normalizeError(unknownError);
      
      expect(normalized.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
      expect(normalized.message).toBe('An unknown error occurred');
      expect(normalized.details?.originalError).toBe(unknownError);
      expect(normalized.retryable).toBe(false);
    });
  });

  describe('handleDatabaseError', () => {
    it('handles connection errors', () => {
      const originalError = new Error('connection failed');
      const result = handleDatabaseError(originalError, 'query');
      
      expect(result.code).toBe(ERROR_CODES.DATABASE_CONNECTION_FAILED);
      expect(result.message).toContain('Database connection failed during query');
      expect(result.retryable).toBe(true);
    });

    it('handles timeout errors', () => {
      const originalError = new Error('operation timeout');
      const result = handleDatabaseError(originalError, 'insert');
      
      expect(result.code).toBe(ERROR_CODES.TIMEOUT);
      expect(result.message).toContain('Database operation timed out during insert');
      expect(result.retryable).toBe(true);
    });

    it('handles constraint violation errors', () => {
      const originalError = new Error('constraint violation');
      const result = handleDatabaseError(originalError, 'update');
      
      expect(result.code).toBe(ERROR_CODES.DATABASE_CONSTRAINT_VIOLATION);
      expect(result.message).toContain('Database constraint violation during update');
      expect(result.retryable).toBe(false);
    });

    it('handles unknown database errors', () => {
      const originalError = new Error('unknown database error');
      const result = handleDatabaseError(originalError, 'delete');
      
      expect(result.code).toBe(ERROR_CODES.DATABASE_QUERY_FAILED);
      expect(result.message).toContain('Database operation failed during delete');
      expect(result.retryable).toBe(false);
    });
  });

  describe('handleImportError', () => {
    it('creates import error with row and column info', () => {
      const originalError = new Error('Invalid data');
      const result = handleImportError(originalError, 5, 'email');
      
      expect(result.row).toBe(5);
      expect(result.column).toBe('email');
      expect(result.message).toBe('Invalid data');
      expect(result.value).toBeUndefined();
    });

    it('creates import error without row and column info', () => {
      const originalError = new Error('File read error');
      const result = handleImportError(originalError);
      
      expect(result.row).toBe(-1);
      expect(result.column).toBe('unknown');
      expect(result.message).toBe('File read error');
    });

    it('handles string errors', () => {
      const result = handleImportError('Validation failed', 1, 'name');
      
      expect(result.row).toBe(1);
      expect(result.column).toBe('name');
      expect(result.message).toBe('Validation failed');
    });
  });

  describe('batchOperation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('processes all items successfully', async () => {
      const items = [1, 2, 3, 4, 5];
      const operation = jest.fn().mockImplementation((item) => Promise.resolve(item * 2));
      
      const result = await batchOperation(items, operation, 2);
      
      expect(result.results).toEqual([2, 4, 6, 8, 10]);
      expect(result.errors).toHaveLength(0);
      expect(operation).toHaveBeenCalledTimes(5);
    });

    it('handles errors in batch', async () => {
      const items = [1, 2, 3, 4, 5];
      const operation = jest.fn().mockImplementation((item) => {
        if (item === 3) {
          return Promise.reject(new Error('Item 3 failed'));
        }
        return Promise.resolve(item * 2);
      });
      
      const result = await batchOperation(items, operation, 2);
      
      expect(result.results).toEqual([2, 4, 8, 10]);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].index).toBe(2); // 0-based index
      expect(result.errors[0].error.message).toBe('Item 3 failed');
    });

    it('respects batch size', async () => {
      const items = [1, 2, 3, 4, 5];
      const operation = jest.fn().mockImplementation((item) => Promise.resolve(item * 2));
      
      await batchOperation(items, operation, 2);
      
      // Should process in batches of 2
      expect(operation).toHaveBeenCalledTimes(5);
    });

    it('handles empty items array', async () => {
      const operation = jest.fn();
      
      const result = await batchOperation([], operation);
      
      expect(result.results).toEqual([]);
      expect(result.errors).toHaveLength(0);
      expect(operation).not.toHaveBeenCalled();
    });
  });

  describe('createErrorBoundary', () => {
    it('creates error boundary component', () => {
      const FallbackComponent = jest.fn().mockReturnValue(<div>Error</div>);
      const ErrorBoundary = createErrorBoundary(FallbackComponent);
      
      expect(ErrorBoundary).toBeDefined();
      expect(typeof ErrorBoundary).toBe('function');
    });

    it('renders children when no error', () => {
      const FallbackComponent = jest.fn().mockReturnValue(<div>Error</div>);
      const ErrorBoundary = createErrorBoundary(FallbackComponent);
      
      const { render } = require('@testing-library/react');
      const { container } = render(
        <ErrorBoundary>
          <div>Content</div>
        </ErrorBoundary>
      );
      
      expect(container.textContent).toContain('Content');
    });

    it('renders fallback when error occurs', () => {
      const FallbackComponent = jest.fn().mockReturnValue(<div>Error occurred</div>);
      const ErrorBoundary = createErrorBoundary(FallbackComponent);
      
      const TestComponent = () => {
        throw new Error('Test error');
      };
      
      const { render } = require('@testing-library/react');
      const { container } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );
      
      expect(container.textContent).toContain('Error occurred');
      expect(FallbackComponent).toHaveBeenCalled();
    });
  });

  describe('ERROR_CODES', () => {
    it('contains all expected error codes', () => {
      expect(ERROR_CODES.NETWORK_ERROR).toBe('network_error');
      expect(ERROR_CODES.DATABASE_CONNECTION_FAILED).toBe('database_connection_failed');
      expect(ERROR_CODES.AUTHENTICATION_FAILED).toBe('authentication_failed');
      expect(ERROR_CODES.VALIDATION_ERROR).toBe('validation_error');
      expect(ERROR_CODES.IMPORT_FAILED).toBe('import_failed');
      expect(ERROR_CODES.UNKNOWN_ERROR).toBe('unknown_error');
    });
  });

  describe('defaultRetryConfig', () => {
    it('has correct default values', () => {
      expect(defaultRetryConfig.maxAttempts).toBe(3);
      expect(defaultRetryConfig.baseDelay).toBe(1000);
      expect(defaultRetryConfig.maxDelay).toBe(10000);
      expect(defaultRetryConfig.backoffMultiplier).toBe(2);
      expect(defaultRetryConfig.retryableErrors).toContain('network_error');
      expect(defaultRetryConfig.retryableErrors).toContain('timeout');
    });
  });
}); 