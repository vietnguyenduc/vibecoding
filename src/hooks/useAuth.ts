import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { User, AuthState } from '../types'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setAuthState(prev => ({
            ...prev,
            error: error.message,
            loading: false,
          }))
          return
        }

        if (session?.user) {
          // Fetch user profile from our users table
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profileError) {
            console.error('Error fetching user profile:', profileError)
          }

          setAuthState({
            user: userProfile || {
              id: session.user.id,
              email: session.user.email || '',
              role: 'staff',
            },
            session,
            loading: false,
            error: null,
          })
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        setAuthState(prev => ({
          ...prev,
          error: 'Failed to get session',
          loading: false,
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setAuthState(prev => ({ ...prev, loading: true }));
          try {
            // Fetch user profile
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profileError) {
              console.error('Error fetching user profile:', profileError)
            }

            setAuthState({
              user: userProfile || {
                id: session.user.id,
                email: session.user.email || '',
                role: 'staff',
              },
              session,
              loading: false,
              error: null,
            })
          } catch (error) {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              error: 'Failed to fetch user profile',
            })
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
          })
        } else {
          // For all other events, do not set loading: true
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setAuthState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }))
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }))
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }))

    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }))
        return { error: error.message }
      }

      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      })

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }))
      return { error: errorMessage }
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) {
      return { error: 'No user logged in' }
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authState.user.id)
        .select()
        .single()

      if (error) {
        setAuthState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }))
        return { error: error.message }
      }

      setAuthState(prev => ({
        ...prev,
        user: data,
        loading: false,
      }))

      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }))
      return { error: errorMessage }
    }
  }

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }))
  }

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signOut,
    updateProfile,
    clearError,
    isAuthenticated: !!authState.user,
  }
} 