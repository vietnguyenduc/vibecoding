import React, { useState, useEffect } from 'react';
import { ErrorFallback } from '../../components/UI/FallbackUI';
import ToggleSwitch from '../../components/UI/ToggleSwitch';
import Button from '../../components/UI/Button';
import { bankAccountService, branchService } from '../../services/database';
import { formatCurrency } from '../../utils/formatting';

interface TransactionType {
  id: string;
  name: string;
  color: string;
  description: string;
  isActive: boolean;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  accountName: string;
  balance: number;
  isActive: boolean;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

interface CustomerField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  required: boolean;
  isActive: boolean;
  options?: string[];
}

const Settings: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('transaction-types');
  const [_loading, setLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Load data from database service
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load bank accounts
        const bankAccountsResponse = await bankAccountService.getBankAccounts();
        if (bankAccountsResponse.error) {
          throw new Error(bankAccountsResponse.error);
        }
        
        const formattedBankAccounts = bankAccountsResponse.data?.map(account => ({
          id: account.id,
          bankName: account.bank_name,
          accountNumber: account.account_number,
          accountType: getAccountType(account.account_name),
          accountName: account.account_name,
          balance: account.balance,
          isActive: account.is_active,
        })) || [];
        
        setBankAccounts(formattedBankAccounts);

        // Load branches
        const branchesResponse = await branchService.getBranches();
        if (branchesResponse.error) {
          throw new Error(branchesResponse.error);
        }
        
        const formattedBranches = branchesResponse.data?.map(branch => ({
          id: branch.id,
          name: branch.name,
          address: branch.address,
          phone: branch.phone,
          isActive: branch.is_active,
        })) || [];
        
        setBranches(formattedBranches);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to determine account type based on account name
  const getAccountType = (accountName: string): string => {
    if (accountName.includes('chính')) return 'TK Chính';
    if (accountName.includes('thanh toán')) return 'TK Thanh toán';
    if (accountName.includes('tiết kiệm')) return 'TK Tiết kiệm';
    if (accountName.includes('vốn lưu động')) return 'TK Vốn lưu động';
    if (accountName.includes('dự phòng')) return 'TK Dự phòng';
    return 'TK Khác';
  };


  // Transaction Types
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([
    { id: '1', name: 'Thanh toán', color: 'green', description: 'Khách hàng thanh toán nợ', isActive: true },
    { id: '2', name: 'Cho nợ', color: 'red', description: 'Cho khách hàng vay tiền', isActive: true },
    { id: '3', name: 'Điều chỉnh', color: 'yellow', description: 'Điều chỉnh số dư', isActive: true },
    { id: '4', name: 'Hoàn tiền', color: 'blue', description: 'Hoàn tiền cho khách hàng', isActive: true },
  ]);

  // Customer Fields
  const [customerFields, setCustomerFields] = useState<CustomerField[]>([
    { id: '1', name: 'Mã khách hàng', type: 'text', required: true, isActive: true },
    { id: '2', name: 'Họ và tên', type: 'text', required: true, isActive: true },
    { id: '3', name: 'Email', type: 'email', required: false, isActive: true },
    { id: '4', name: 'Số điện thoại', type: 'phone', required: false, isActive: true },
    { id: '5', name: 'Địa chỉ', type: 'textarea', required: false, isActive: true },
    { id: '6', name: 'Loại khách hàng', type: 'select', required: false, isActive: true, options: ['Cá nhân', 'Doanh nghiệp', 'Tổ chức'] },
  ]);



  // Color options for transaction types
  const colorOptions = [
    { value: 'green', label: 'Xanh lá', class: 'bg-green-100 text-green-800' },
    { value: 'red', label: 'Đỏ', class: 'bg-red-100 text-red-800' },
    { value: 'blue', label: 'Xanh dương', class: 'bg-blue-100 text-blue-800' },
    { value: 'yellow', label: 'Vàng', class: 'bg-yellow-100 text-yellow-800' },
    { value: 'purple', label: 'Tím', class: 'bg-purple-100 text-purple-800' },
    { value: 'gray', label: 'Xám', class: 'bg-gray-100 text-gray-800' },
  ];

  const getColorClass = (color: string) => {
    const colorOption = colorOptions.find(opt => opt.value === color);
    return colorOption?.class || 'bg-gray-100 text-gray-800';
  };



  const handleToggleActive = (type: string, id: string) => {
    switch (type) {
      case 'transaction-type':
        setTransactionTypes(prev => 
          prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item)
        );
        break;
      case 'bank-account':
        setBankAccounts(prev => 
          prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item)
        );
        break;
      case 'branch':
        setBranches(prev => 
          prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item)
        );
        break;
      case 'customer-field':
        setCustomerFields(prev => 
          prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item)
        );
        break;
    }
  };

  const tabs = [
    { id: 'transaction-types', name: 'Loại giao dịch', icon: '📊' },
    { id: 'bank-accounts', name: 'Tài khoản ngân hàng', icon: '🏦' },
    { id: 'branches', name: 'Chi nhánh', icon: '🏢' },
    { id: 'customer-fields', name: 'Trường khách hàng', icon: '👥' },
  ];



  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorFallback 
            title="Lỗi cấu hình"
            message={error}
            retry={() => setError(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="mt-2 text-gray-600">
            Quản lý cấu hình cơ bản cho hệ thống quản lý công nợ
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Transaction Types */}
          {activeTab === 'transaction-types' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Loại giao dịch</h2>
                <Button variant="primary" size="md">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm loại mới
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transactionTypes.map((type) => (
                  <div key={type.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(type.color)}`}>
                        {type.name}
                      </span>
                      <div className="flex items-center space-x-3">

                        <ToggleSwitch
                          checked={type.isActive}
                          onChange={() => handleToggleActive('transaction-type', type.id)}
                          size="md"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank Accounts */}
          {activeTab === 'bank-accounts' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Tài khoản ngân hàng</h2>
                <Button variant="primary" size="md">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm tài khoản
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngân hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tài khoản
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại tài khoản
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên tài khoản
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số dư
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bankAccounts.map((account) => (
                      <tr key={account.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {account.bankName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {account.accountNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {account.accountType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {account.accountName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(account.balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {account.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">

                            <ToggleSwitch
                              checked={account.isActive}
                              onChange={() => handleToggleActive('bank-account', account.id)}
                              size="sm"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Branches */}
          {activeTab === 'branches' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Chi nhánh</h2>
                <Button variant="primary" size="md">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm chi nhánh
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                  <div key={branch.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{branch.name}</h3>
                      <div className="flex items-center space-x-3">

                        <ToggleSwitch
                          checked={branch.isActive}
                          onChange={() => handleToggleActive('branch', branch.id)}
                          size="md"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Địa chỉ:</span> {branch.address}</p>
                      <p><span className="font-medium">Điện thoại:</span> {branch.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Fields */}
          {activeTab === 'customer-fields' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Trường khách hàng</h2>
                <Button variant="primary" size="md">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm trường
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên trường
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bắt buộc
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customerFields.map((field) => (
                      <tr key={field.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {field.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="capitalize">{field.type}</span>
                          {field.options && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({field.options.length} tùy chọn)
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            field.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {field.required ? 'Bắt buộc' : 'Tùy chọn'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            field.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {field.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">

                            <ToggleSwitch
                              checked={field.isActive}
                              onChange={() => handleToggleActive('customer-field', field.id)}
                              size="sm"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 