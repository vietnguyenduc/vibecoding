import { format, parseISO } from 'date-fns';

// Currency formatting
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Date formatting
export const formatDate = (date: string | Date, formatString = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Date and time formatting
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

// Time formatting
export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

// Number formatting
export const formatNumber = (number: number, decimals = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

// Percentage formatting
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${formatNumber(value, decimals)}%`;
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

// Credit card number formatting
export const formatCreditCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cardNumber;
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Capitalize first letter
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Title case
export const titleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Format relative time
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateObj);
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid Date';
  }
};

// Transaction type formatting
export const formatTransactionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    payment: 'Payment',
    charge: 'Charge',
    adjustment: 'Adjustment',
    refund: 'Refund'
  }
  return typeMap[type] || capitalize(type)
}

// User role formatting
export const formatUserRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: 'Administrator',
    branch_manager: 'Branch Manager',
    staff: 'Staff'
  }
  return roleMap[role] || capitalize(role.replace('_', ' '))
}

// Status formatting
export const formatStatus = (status: boolean | string): string => {
  if (typeof status === 'boolean') {
    return status ? 'Active' : 'Inactive'
  }
  return capitalize(status)
}

// Table cell formatting helpers
export const formatTableCell = (value: any, type: 'text' | 'number' | 'currency' | 'date' | 'datetime' | 'phone' | 'status' | 'type' | 'role'): string => {
  if (value === null || value === undefined) return '-'
  
  switch (type) {
    case 'number':
      return formatNumber(Number(value))
    case 'currency':
      return formatCurrency(Number(value))
    case 'date':
      return formatDate(value)
    case 'datetime':
      return formatDateTime(value)
    case 'phone':
      return formatPhoneNumber(String(value))
    case 'status':
      return formatStatus(value)
    case 'type':
      return formatTransactionType(String(value))
    case 'role':
      return formatUserRole(String(value))
    default:
      return String(value)
  }
}

// CSV/Excel data formatting
export const formatForExport = (data: any[], columns: Array<{ key: string; label: string; type?: string }>): any[] => {
  return data.map(row => {
    const formattedRow: any = {}
    columns.forEach(column => {
      const value = row[column.key]
      if (column.type) {
        formattedRow[column.label] = formatTableCell(value, column.type as any)
      } else {
        formattedRow[column.label] = value
      }
    })
    return formattedRow
  })
} 