import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionImport from '../TransactionImport';
import { databaseService } from '../../../services/database';

jest.mock('../../../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-1', branch_id: 'branch-1' },
  }),
}));

const mockBulkImportTransactions = jest.fn().mockResolvedValue({
  data: [{ id: 'txn-1' }],
  errors: [],
});

databaseService.transactions = {
  getTransactions: jest.fn(),
  getTransactionById: jest.fn(),
  createTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn(),
  bulkImportTransactions: mockBulkImportTransactions,
};

describe('TransactionImport Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow user to paste, validate, and import transaction data', async () => {
    render(<TransactionImport onImportComplete={jest.fn()} />);

    // Simulate pasting data
    const textarea = screen.getByPlaceholderText(/paste your data here/i);
    fireEvent.change(textarea, {
      target: {
        value: 'John Doe\t123456\tpayment\t1000\t2024-06-01',
      },
    });

    // Validate data
    const validateBtn = screen.getByRole('button', { name: /validate data/i });
    fireEvent.click(validateBtn);

    // Show preview and import
    await waitFor(() => {
      expect(screen.getByText(/data preview/i)).toBeInTheDocument();
    });

    const importBtn = screen.getByRole('button', { name: /import data/i });
    fireEvent.click(importBtn);

    // Wait for import to complete
    await waitFor(() => {
      expect(mockBulkImportTransactions).toHaveBeenCalledWith(
        expect.any(Array),
        'branch-1',
        'user-1'
      );
    });
  });

  it('should show validation errors for invalid data', async () => {
    render(<TransactionImport onImportComplete={jest.fn()} />);

    // Simulate pasting invalid data (missing required fields)
    const textarea = screen.getByPlaceholderText(/paste your data here/i);
    fireEvent.change(textarea, {
      target: {
        value: '\t\t\t\t',
      },
    });

    // Validate data
    const validateBtn = screen.getByRole('button', { name: /validate data/i });
    fireEvent.click(validateBtn);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/validation errors/i)).toBeInTheDocument();
    });
  });
}); 