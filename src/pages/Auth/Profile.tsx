import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useI18n } from '../../hooks/useI18n';
import { validateEmail, validateRequired } from '../../utils/validation';

interface ProfileFormData {
  full_name: string;
  email: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile, loading } = useAuthContext();
  const { t } = useI18n();

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    const fullNameError = validateRequired(formData.full_name, 'Full name');
    if (fullNameError) newErrors.full_name = fullNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ProfileFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaveLoading(true);
      setMessage(null);

      const result = await updateProfile({
        full_name: formData.full_name,
        email: formData.email,
      });

      if (result.error) {
        setMessage({
          type: 'error',
          text: result.error,
        });
        return;
      }

      setMessage({
        type: 'success',
        text: t('profile.messages.updateSuccess'),
      });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : t('profile.messages.updateError'),
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
      });
    }
    setErrors({});
    setMessage(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            {t('profile.notAuthenticated')}
          </h2>
          <p className='text-gray-600'>{t('profile.pleaseLogin')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow rounded-lg'>
          {/* Header */}
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h1 className='text-2xl font-bold text-gray-900'>
                {t('profile.title')}
              </h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  {t('profile.edit')}
                </button>
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`px-6 py-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border-l-4 border-green-400'
                  : 'bg-red-50 border-l-4 border-red-400'
              }`}
            >
              <div className='flex'>
                <div className='flex-shrink-0'>
                  {message.type === 'success' ? (
                    <svg
                      className='h-5 w-5 text-green-400'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    <svg
                      className='h-5 w-5 text-red-400'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </div>
                <div className='ml-3'>
                  <p
                    className={`text-sm ${
                      message.type === 'success'
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Form */}
          <div className='px-6 py-6'>
            <div className='space-y-6'>
              {/* Role Display (Read-only) */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('profile.role')}
                </label>
                <div className='inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-800'>
                  {t(`roles.${user.role}`)}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor='full_name'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  {t('profile.fullName')} *
                </label>
                <input
                  type='text'
                  id='full_name'
                  name='full_name'
                  value={formData.full_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`form-input w-full ${
                    errors.full_name ? 'border-red-500' : ''
                  } ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder={t('profile.fullNamePlaceholder')}
                />
                {errors.full_name && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.full_name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  {t('profile.email')} *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`form-input w-full ${
                    errors.email ? 'border-red-500' : ''
                  } ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder={t('profile.emailPlaceholder')}
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
                  <button
                    onClick={handleCancel}
                    disabled={saveLoading}
                    className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
                  >
                    {t('profile.cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
                  >
                    {saveLoading ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        {t('profile.saving')}
                      </>
                    ) : (
                      t('profile.save')
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
