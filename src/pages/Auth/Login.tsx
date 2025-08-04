import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import { AuthService } from '../../services/auth';

const authService = new AuthService();

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, loading, error, clearError, isAuthenticated } =
    useAuthContext();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    let fullNameValidation = '';

    if (isSignUp && !fullName.trim()) {
      fullNameValidation = 'Full name is required';
    }

    setEmailError(emailValidation || '');
    setPasswordError(passwordValidation || '');
    setFullNameError(fullNameValidation);

    return !emailValidation && !passwordValidation && !fullNameValidation;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    console.log('🚀 Attempting sign in...', { email });

    try {
      const result = await signIn(email, password);

      console.log('🔐 Sign in result:', result);

      if (result?.error) {
        console.error('❌ Sign in failed:', result.error);
      }
    } catch (err) {
      console.error('💥 Sign in exception:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Sign up with ABC Company tenant to access Vietnamese mock data
      const { user, error: signUpError } = await authService.signUpWithTenant(
        email,
        password,
        fullName,
        'abc-company', // Automatically assign to ABC Company tenant
        'staff' // Default role
      );

      if (signUpError) {
        console.error('❌ Sign up failed:', signUpError);
        return;
      }

      if (user) {
        // Now sign in the user
        const signInResult = await signIn(email, password);
        if (!signInResult.error) {
          navigate('/dashboard');
        } else {
          console.error(
            '❌ Account created but auto sign-in failed. User should sign in manually.'
          );
        }
      }
    } catch (err) {
      console.error('💥 Sign up exception:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setFullName('');
    setEmailError('');
    setPasswordError('');
    setFullNameError('');
    clearError();
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Debt Repayment Management System
          </p>
          {isSignUp && (
            <p className='mt-1 text-center text-xs text-blue-600'>
              You'll be automatically assigned to ABC Company to view the
              Vietnamese mock data
            </p>
          )}
        </div>
        <form
          className='mt-8 space-y-6'
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
        >
          <div className='space-y-4'>
            {isSignUp && (
              <div>
                <label htmlFor='fullName' className='sr-only'>
                  Full Name
                </label>
                <input
                  id='fullName'
                  name='fullName'
                  type='text'
                  autoComplete='name'
                  required
                  className={`form-input w-full ${fullNameError ? 'border-red-500' : ''}`}
                  placeholder='Full Name'
                  value={fullName}
                  onChange={e => {
                    setFullName(e.target.value);
                    if (fullNameError) setFullNameError('');
                  }}
                />
                {fullNameError && (
                  <p className='text-red-500 text-sm mt-1'>{fullNameError}</p>
                )}
              </div>
            )}
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                className={`form-input w-full ${emailError ? 'border-red-500' : ''}`}
                placeholder='Email address'
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
              />
              {emailError && (
                <p className='text-red-500 text-sm mt-1'>{emailError}</p>
              )}
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className={`form-input w-full ${passwordError ? 'border-red-500' : ''}`}
                placeholder='Password'
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
              />
              {passwordError && (
                <p className='text-red-500 text-sm mt-1'>{passwordError}</p>
              )}
            </div>
          </div>

          {error && (
            <div className='mb-4 p-4 border border-red-300 rounded-md bg-red-50'>
              <div className='flex'>
                <div className='flex-shrink-0'>
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
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>Error</h3>
                  <div className='mt-1 text-sm text-red-700'>{error}</div>
                  <div className='mt-2 text-xs text-red-600'>
                    <strong>Debug info:</strong> Check browser console for
                    detailed error logs
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={loading || isLoading}
              className='btn-primary w-full'
            >
              {loading || isLoading
                ? isSignUp
                  ? 'Creating account...'
                  : 'Signing in...'
                : isSignUp
                  ? 'Create Account'
                  : 'Sign in'}
            </button>
          </div>

          <div className='text-center'>
            <button
              type='button'
              onClick={toggleMode}
              className='text-blue-600 hover:text-blue-800 text-sm font-medium'
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
