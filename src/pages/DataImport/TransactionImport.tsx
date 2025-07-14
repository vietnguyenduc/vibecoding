import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Transaction, ImportData, ImportError, Customer } from '../../types';
import { validateTransactionData, parseTransactionData } from '../../utils/importUtils';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { LoadingFallback, ErrorFallback } from '../../components/UI/FallbackUI';
import { databaseService } from '../../services/database';

interface TransactionImportProps {
  onImportComplete?: (data: Transaction[]) => void;
}

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Partial<Customer>) => void;
  customerName: string;
  isLoading?: boolean;
}

const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customerName,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: customerName,
    phone: '',
    email: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      branch_id: user?.branch_id || '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('import.addNewCustomer')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('customers.fullName')} *
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('customers.phone')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('customers.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('customers.address')}
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.full_name.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TransactionImport: React.FC<TransactionImportProps> = ({ onImportComplete }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [importData, setImportData] = useState<ImportData>({
    file: null,
    data: [],
    errors: [],
    isValid: false,
  });
  const [rawData, setRawData] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showPreview, setShowPreview] = useState(false);
  
  // New customer modal state
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [unmatchedCustomers, setUnmatchedCustomers] = useState<Set<string>>(new Set());

  // Parse and validate data when raw data changes
  const processedData = useMemo(() => {
    if (!rawData.trim()) {
      return { data: [], errors: [], isValid: false };
    }

    try {
      const parsed = parseTransactionData(rawData);
      const validation = validateTransactionData(parsed, user?.branch_id);
      
      // Extract unmatched customer names
      const customerNames = new Set(parsed.map(row => row.customer_name.trim()));
      setUnmatchedCustomers(customerNames);
      
      return {
        data: parsed,
        errors: validation.errors,
        isValid: validation.isValid,
      };
    } catch (error) {
      return {
        data: [],
        errors: [{ row: 0, column: 'general', message: error instanceof Error ? error.message : 'Parse error' }],
        isValid: false,
      };
    }
  }, [rawData, user?.branch_id]);

  // Update import data when processed data changes
  React.useEffect(() => {
    setImportData({
      file: null,
      data: processedData.data,
      errors: processedData.errors,
      isValid: processedData.isValid,
    });
  }, [processedData]);

  const handleRawDataChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawData(e.target.value);
    setCurrentStep(1);
  }, []);

  const handleValidateData = useCallback(() => {
    setShowPreview(true);
    setCurrentStep(2);
  }, []);

  const handleAddNewCustomer = useCallback((customerName: string) => {
    setNewCustomerName(customerName);
    setShowNewCustomerModal(true);
  }, []);

  const handleSaveNewCustomer = useCallback(async (customerData: Partial<Customer>) => {
    setIsCreatingCustomer(true);
    try {
      const result = await databaseService.customers.createCustomer(customerData);
      
      if (result.data) {
        // Remove from unmatched customers
        setUnmatchedCustomers(prev => {
          const newSet = new Set(prev);
          newSet.delete(customerData.full_name || '');
          return newSet;
        });
        
        setShowNewCustomerModal(false);
        setNewCustomerName('');
      } else if (result.error) {
        console.error('Failed to create customer:', result.error);
        // TODO: Show error notification
      }
    } catch (error) {
      console.error('Failed to create customer:', error);
      // TODO: Show error notification
    } finally {
      setIsCreatingCustomer(false);
    }
  }, []);

  const handleImportData = useCallback(async () => {
    if (!importData.isValid || importData.data.length === 0 || !user?.branch_id) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await databaseService.transactions.bulkImportTransactions(
        importData.data as any[],
        user.branch_id,
        user.id
      );
      
      if (result.errors.length > 0) {
        console.error('Import completed with errors:', result.errors);
        // TODO: Show error notification with details
      }
      
      setCurrentStep(3);
      onImportComplete?.(result.data);
      
      // Reset form
      setRawData('');
      setImportData({ file: null, data: [], errors: [], isValid: false });
      setShowPreview(false);
      setCurrentStep(1);
      setUnmatchedCustomers(new Set());
    } catch (error) {
      console.error('Import failed:', error);
      // TODO: Show error notification
    } finally {
      setIsProcessing(false);
    }
  }, [importData, onImportComplete, user]);

  const handleReset = useCallback(() => {
    setRawData('');
    setImportData({ file: null, data: [], errors: [], isValid: false });
    setShowPreview(false);
    setCurrentStep(1);
    setUnmatchedCustomers(new Set());
  }, []);

  const getErrorForRow = (rowIndex: number): ImportError[] => {
    return importData.errors.filter(error => error.row === rowIndex);
  };

  const getErrorForCell = (rowIndex: number, column: string): ImportError | undefined => {
    return importData.errors.find(error => error.row === rowIndex && error.column === column);
  };

  const renderUnmatchedCustomers = () => {
    if (unmatchedCustomers.size === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-orange-900 mb-4">
          {t('import.unmatchedCustomers')} ({unmatchedCustomers.size})
        </h3>
        
        <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
          <p className="text-sm text-orange-800 mb-3">
            {t('import.unmatchedCustomersDescription')}
          </p>
          
          <div className="space-y-2">
            {Array.from(unmatchedCustomers).map((customerName, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-md p-3">
                <span className="text-sm text-gray-900">{customerName}</span>
                <button
                  onClick={() => handleAddNewCustomer(customerName)}
                  className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('import.addCustomer')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDataPreview = () => {
    if (!showPreview || importData.data.length === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('import.dataPreview')} ({importData.data.length} {t('import.totalRows')})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.customer')}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.bankAccount')}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.transactionType')}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.amount')}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.transactionDate')}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.description')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importData.data.slice(0, 10).map((row, index) => {
                const rowErrors = getErrorForRow(index);
                const hasRowError = rowErrors.length > 0;
                
                return (
                  <tr key={index} className={hasRowError ? 'bg-red-50' : ''}>
                    <td className={`px-3 py-2 text-sm ${getErrorForCell(index, 'customer_name') ? 'bg-red-100' : ''}`}>
                      {row.customer_name || '-'}
                    </td>
                    <td className={`px-3 py-2 text-sm ${getErrorForCell(index, 'bank_account') ? 'bg-red-100' : ''}`}>
                      {row.bank_account || '-'}
                    </td>
                    <td className={`px-3 py-2 text-sm ${getErrorForCell(index, 'transaction_type') ? 'bg-red-100' : ''}`}>
                      {row.transaction_type || '-'}
                    </td>
                    <td className={`px-3 py-2 text-sm ${getErrorForCell(index, 'amount') ? 'bg-red-100' : ''}`}>
                      {row.amount ? formatCurrency(row.amount) : '-'}
                    </td>
                    <td className={`px-3 py-2 text-sm ${getErrorForCell(index, 'transaction_date') ? 'bg-red-100' : ''}`}>
                      {row.transaction_date ? formatDate(row.transaction_date) : '-'}
                    </td>
                    <td className={`px-3 py-2 text-sm ${getErrorForCell(index, 'description') ? 'bg-red-100' : ''}`}>
                      {row.description || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {importData.data.length > 10 && (
          <p className="mt-2 text-sm text-gray-500">
            {t('import.showingFirst10')} {importData.data.length} {t('import.totalRows')}
          </p>
        )}
      </div>
    );
  };

  const renderValidationErrors = () => {
    if (importData.errors.length === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-red-900 mb-4">
          {t('import.validationErrors')} ({importData.errors.length})
        </h3>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="max-h-60 overflow-y-auto">
            {importData.errors.slice(0, 20).map((error, index) => (
              <div key={index} className="text-sm text-red-800 mb-2">
                <span className="font-medium">
                  {t('import.row')} {error.row + 1}, {t('import.column')} {error.column}:
                </span>{' '}
                {error.message}
                {error.value && (
                  <span className="text-red-600 ml-2">
                    ({t('import.value')}: {error.value})
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {importData.errors.length > 20 && (
            <p className="text-sm text-red-600 mt-2">
              {t('import.showingFirst20')} {importData.errors.length} {t('import.totalErrors')}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingFallback 
            title={t('import.importing')}
            message={t('import.processingData')}
            size="lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{t('import.transactionImport')}</h1>
            <p className="mt-1 text-sm text-gray-600">
              {t('import.transactionImportDescription')}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">{t('import.step1')}</span>
              </div>
              
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">{t('import.step2')}</span>
              </div>
              
              <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">{t('import.step3')}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Step 1: Data Input */}
            <div className="space-y-6">
              <div>
                <label htmlFor="rawData" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('import.pasteData')}
                </label>
                <textarea
                  id="rawData"
                  value={rawData}
                  onChange={handleRawDataChange}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('import.pastePlaceholder')}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {t('import.pasteInstructions')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('common.reset')}
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={handleValidateData}
                    disabled={!rawData.trim()}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('import.validateData')}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Validation Results */}
            {showPreview && (
              <div className="mt-8 space-y-6">
                {/* Validation Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{importData.data.length}</div>
                      <div className="text-sm text-gray-500">{t('import.totalRows')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {importData.data.length - importData.errors.length}
                      </div>
                      <div className="text-sm text-gray-500">{t('import.validRows')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{importData.errors.length}</div>
                      <div className="text-sm text-gray-500">{t('import.invalidRows')}</div>
                    </div>
                  </div>
                </div>

                {/* Data Preview */}
                {renderDataPreview()}

                {/* Validation Errors */}
                {renderValidationErrors()}

                {/* Unmatched Customers */}
                {renderUnmatchedCustomers()}

                {/* Import Action */}
                <div className="flex justify-end">
                  <button
                    onClick={handleImportData}
                    disabled={!importData.isValid || importData.data.length === 0}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('import.importData')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success Message */}
            {currentStep === 3 && (
              <div className="mt-8">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        {t('import.importSuccess')}
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        {t('import.importedRows', { count: importData.data.length })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      <NewCustomerModal
        isOpen={showNewCustomerModal}
        onClose={() => setShowNewCustomerModal(false)}
        onSave={handleSaveNewCustomer}
        customerName={newCustomerName}
        isLoading={isCreatingCustomer}
      />
    </div>
  );
};

export default TransactionImport; 