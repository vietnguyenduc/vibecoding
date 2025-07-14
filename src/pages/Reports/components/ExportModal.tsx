import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportType, ExportFormat } from '../../../types';

interface ExportModalProps {
  onClose: () => void;
  onExport: (format: ExportFormat, options: any) => void;
  reportType: ReportType;
  progress: number;
  error: string | null;
}

const ExportModal: React.FC<ExportModalProps> = ({
  onClose,
  onExport,
  reportType,
  progress,
  error,
}) => {
  const { t } = useTranslation();
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);

  const handleExport = () => {
    const options = {
      includeHeaders,
      includeCharts,
      includeDetails,
    };
    onExport(format, options);
  };

  const getReportTypeLabel = () => {
    switch (reportType) {
      case 'keyMetrics':
        return t('reports.keyMetrics.title');
      case 'customerBalance':
        return t('reports.customerBalance.title');
      case 'transactionReport':
        return t('reports.transactionReport.title');
      case 'cashFlowReport':
        return t('reports.cashFlowReport.title');
      default:
        return t('reports.unknownReportType');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('reports.export.title')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('reports.export.subtitle')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Report Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {t('reports.export.reportInfo')}
              </h4>
              <p className="text-sm text-gray-600">
                {getReportTypeLabel()}
              </p>
            </div>

            {/* Export Options */}
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('reports.export.format')}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="excel"
                      checked={format === 'excel'}
                      onChange={(e) => setFormat(e.target.value as ExportFormat)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">
                        {t('reports.export.excel')}
                      </span>
                      <span className="block text-sm text-gray-500">
                        {t('reports.export.excelDescription')}
                      </span>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={format === 'csv'}
                      onChange={(e) => setFormat(e.target.value as ExportFormat)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">
                        {t('reports.export.csv')}
                      </span>
                      <span className="block text-sm text-gray-500">
                        {t('reports.export.csvDescription')}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Include Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('reports.export.includeOptions')}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeHeaders}
                      onChange={(e) => setIncludeHeaders(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t('reports.export.includeHeaders')}
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t('reports.export.includeCharts')}
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeDetails}
                      onChange={(e) => setIncludeDetails(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t('reports.export.includeDetails')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Progress Bar */}
              {progress > 0 && progress < 100 && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{t('reports.export.exporting')}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {t('reports.export.error')}
                      </h3>
                      <p className="mt-1 text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {progress === 100 && !error && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        {t('reports.export.success')}
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        {t('reports.export.downloadStarted')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {progress === 0 && (
              <button
                onClick={handleExport}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t('reports.export.export')}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {progress === 100 ? t('common.close') : t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 