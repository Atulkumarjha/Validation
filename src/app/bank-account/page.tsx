'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BuildingLibraryIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

interface BankAccountForm {
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: 'savings' | 'current' | 'salary';
}

export default function BankAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<BankAccountForm>({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'savings'
  });

  // Check if user is authenticated
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/signin');
      return;
    }

    const user = JSON.parse(userData);
    if (!user.isPanVerified) {
      router.push('/pan-verification');
      return;
    }

    // Pre-fill account holder name from user data
    if (user.name) {
      setFormData(prev => ({
        ...prev,
        accountHolderName: user.name
      }));
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format specific fields
    let formattedValue = value;
    if (name === 'ifscCode') {
      formattedValue = value.toUpperCase();
    } else if (name === 'accountNumber' || name === 'confirmAccountNumber') {
      formattedValue = value.replace(/\D/g, ''); // Only numbers
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateForm = (): string | null => {
    const { accountHolderName, accountNumber, confirmAccountNumber, ifscCode, bankName, branchName } = formData;

    if (!accountHolderName.trim()) return 'Account holder name is required';
    if (accountHolderName.trim().length < 2) return 'Account holder name must be at least 2 characters';

    if (!accountNumber.trim()) return 'Account number is required';
    if (accountNumber.length < 9 || accountNumber.length > 18) return 'Account number must be 9-18 digits';
    if (!/^\d+$/.test(accountNumber)) return 'Account number must contain only digits';

    if (accountNumber !== confirmAccountNumber) return 'Account numbers do not match';

    if (!ifscCode.trim()) return 'IFSC code is required';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) return 'Invalid IFSC code format';

    if (!bankName.trim()) return 'Bank name is required';
    if (!branchName.trim()) return 'Branch name is required';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/signin');
      return;
    }

    const user = JSON.parse(userData);
    setIsLoading(true);

    try {
      const response = await fetch('/api/bank-account/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          phone: user.phone,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add bank account');
      }

      setIsSuccess(true);

      // Redirect to success page after showing success message
      setTimeout(() => {
        router.push('/success');
      }, 2000);

    } catch (error) {
      console.error('Error adding bank account:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add bank account. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bank Account Added!</h1>
            <p className="text-gray-600 mb-6">
              Your bank account details have been successfully saved. Redirecting you to the dashboard...
            </p>
            <div className="animate-spin inline-block w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <BuildingLibraryIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Account Details</h1>
          <p className="text-gray-600">
            Please provide your bank account information for secure transactions
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Holder Name */}
            <div>
              <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name *
              </label>
              <input
                type="text"
                id="accountHolderName"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter account holder name"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter account number"
                maxLength={18}
                required
              />
            </div>

            {/* Confirm Account Number */}
            <div>
              <label htmlFor="confirmAccountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Account Number *
              </label>
              <input
                type="text"
                id="confirmAccountNumber"
                name="confirmAccountNumber"
                value={formData.confirmAccountNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Re-enter account number"
                maxLength={18}
                required
              />
              {formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  Account numbers do not match
                </p>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code *
              </label>
              <input
                type="text"
                id="ifscCode"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., SBIN0000123"
                maxLength={11}
                required
              />
              <p className="text-gray-500 text-sm mt-1">11-character IFSC code (e.g., SBIN0000123)</p>
            </div>

            {/* Bank Name */}
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., State Bank of India"
                required
              />
            </div>

            {/* Branch Name */}
            <div>
              <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name *
              </label>
              <input
                type="text"
                id="branchName"
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Mumbai Main Branch"
                required
              />
            </div>

            {/* Account Type */}
            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-2">
                Account Type *
              </label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="savings">Savings Account</option>
                <option value="current">Current Account</option>
                <option value="salary">Salary Account</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Adding Bank Account...
                </>
              ) : (
                <>
                  <CreditCardIcon className="w-5 h-5 mr-2" />
                  Add Bank Account
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <CheckCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Secure & Encrypted</p>
                <p>Your bank account information is encrypted and stored securely. We never store your banking passwords or PINs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
