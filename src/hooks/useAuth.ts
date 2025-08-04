import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { AuthService } from '../services/auth';
import { User } from '../types';

// Initialize AuthService
const authService = new AuthService();

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setError(sessionError.message);
        return;
      }

      if (currentSession) {
        setSession(currentSession);
        
        // Get user profile with tenant info
        const { user: authUser, error: userError } = await authService.getCurrentUser();
        
        if (userError) {
          console.error('User profile error:', userError);
          setError(userError);
        } else if (authUser) {
          setUser(authUser as User);
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err instanceof Error ? err.message : 'Authentication error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      setLoading(true);
      setError(null);

      // Use the ABC Company tenant for Vietnamese mock data
      const { user: authUser, error: authError } = await authService.signInWithTenant(email, password, 'abc-company');

      if (authError) {
        setError(authError);
        return { error: authError };
      }

      if (authUser) {
        setUser(authUser as User);
        
        // Get fresh session
        const { data: { session: newSession } } = await supabase.auth.getSession();
        setSession(newSession);
      }

      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async (): Promise<{ error: string | null }> => {
    try {
      setLoading(true);
      setError(null);

      const { error: signOutError } = await authService.signOut();

      if (signOutError) {
        setError(signOutError);
        return { error: signOutError };
      }

      // Clear local state
      setUser(null);
      setSession(null);

      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (updates: Partial<User>): Promise<{ data?: User; error: string | null }> => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        return { error: 'No user logged in' };
      }

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        setError(updateError.message);
        return { error: updateError.message };
      }

      // Update local user state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      return { data: updatedUser, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Set up auth state listener
  useEffect(() => {
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔐 SIGNED_IN event triggered, fetching user profile...');
        
        // Get user profile with tenant info
        const { user: authUser, error: userError } = await authService.getCurrentUser();
        
        console.log('👤 getCurrentUser result:', { authUser: !!authUser, userError });
        
        if (userError) {
          console.error('❌ User profile error:', userError);
          setError(userError);
          setUser(null);
        } else if (authUser) {
          console.log('✅ User profile loaded successfully:', { id: authUser.id, email: authUser.email, tenant_id: authUser.tenant_id });
          setUser(authUser as User);
          setError(null);
        } else {
          console.error('❌ No user profile returned (but no error either)');
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 SIGNED_OUT event triggered');
        setUser(null);
        setError(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  // Check if user is authenticated
  const isAuthenticated = !!(session && user);

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signOut,
    updateProfile,
    clearError,
    isAuthenticated,
  };
}; 