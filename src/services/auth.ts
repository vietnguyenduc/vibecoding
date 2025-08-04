import { supabase } from './supabase';
import { User, Tenant } from '../types';

export interface AuthUser extends User {
  tenant?: Tenant;
}

export class AuthService {
  /**
   * Sign in user with tenant context
   */
  async signInWithTenant(email: string, password: string, tenantSlug: string): Promise<{ user: User | null; error: string | null }> {
    try {
      console.log('🔐 Starting sign in process...', { email, tenantSlug });
      
      // Sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 Sign in result:', { signInData: !!signInData.user, signInError });

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        return { user: null, error: signInError.message };
      }

      if (!signInData.user) {
        console.error('❌ No user returned from sign in');
        return { user: null, error: 'No user returned from authentication' };
      }

      console.log('✅ User signed in, fetching profile...');

      // Get user profile with tenant info
      const { user, error: profileError } = await this.getCurrentUser();
      
      console.log('👤 Profile fetch result:', { user: !!user, profileError });

      if (profileError) {
        console.error('❌ Profile fetch error:', profileError);
        return { user: null, error: profileError };
      }

      console.log('✅ Authentication successful!', { userId: user?.id, tenantId: user?.tenant_id });
      return { user, error: null };
      
    } catch (error) {
      console.error('💥 Authentication exception:', error);
      const message = error instanceof Error ? error.message : 'Authentication failed';
      return { user: null, error: message };
    }
  }

  /**
   * Sign up user and associate with tenant
   */
  async signUpWithTenant(
    email: string, 
    password: string, 
    fullName: string,
    tenantSlug: string,
    role: 'admin' | 'branch_manager' | 'staff' = 'staff'
  ) {
    try {
      // 1. Get tenant by slug
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', tenantSlug)
        .eq('is_active', true)
        .single();

      if (tenantError || !tenant) {
        return { user: null, error: 'Invalid or inactive tenant' };
      }

      // 2. Sign up the user with tenant info in metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            tenant_id: tenant.id,
            role: role,
          }
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'No user returned from sign up' };
      }

      // 3. Wait a moment for the trigger to create the user profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Get the user profile that was created by the trigger
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          tenant:tenants(*)
        `)
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return { user: null, error: 'User created but failed to load profile. Please try signing in.' };
      }

      return { 
        user: userProfile as AuthUser, 
        error: null 
      };
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get current authenticated user with tenant info
   */
  async getCurrentUser(): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      console.log('🔍 getCurrentUser: Starting user fetch...');
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      console.log('🔍 getCurrentUser: Auth user result:', { authUser: !!authUser, authError });

      if (authError) {
        console.error('❌ getCurrentUser: Auth error:', authError);
        return { user: null, error: authError.message };
      }

      if (!authUser) {
        console.log('ℹ️ getCurrentUser: No auth user found');
        return { user: null, error: null };
      }

      console.log('🔍 getCurrentUser: Fetching user profile for ID:', authUser.id);

      // Get user profile with tenant information
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          tenant:tenants(*)
        `)
        .eq('id', authUser.id)
        .single();

      console.log('🔍 getCurrentUser: Profile result:', { userProfile: !!userProfile, profileError });

      if (profileError) {
        console.error('❌ getCurrentUser: Profile error:', profileError);
        return { user: null, error: `Failed to load user profile: ${profileError.message}` };
      }

      if (!userProfile) {
        console.error('❌ getCurrentUser: No user profile found');
        return { user: null, error: 'User profile not found' };
      }

      console.log('✅ getCurrentUser: Success!', { 
        id: userProfile.id, 
        email: userProfile.email, 
        tenant_id: userProfile.tenant_id 
      });

      return { 
        user: userProfile as AuthUser, 
        error: null 
      };
    } catch (error) {
      console.error('💥 getCurrentUser: Exception:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  }

  /**
   * Get available tenants (for login page tenant selection)
   */
  async getActiveTenants(): Promise<{ tenants: Tenant[]; error: string | null }> {
    try {
      const { data: tenants, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        return { tenants: [], error: error.message };
      }

      return { tenants: tenants || [], error: null };
    } catch (error) {
      return { 
        tenants: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Switch user to different tenant (if they have access)
   */
  async switchTenant(tenantSlug: string) {
    try {
      const currentUser = await this.getCurrentUser();
      
      if (!currentUser.user) {
        return { success: false, error: 'No authenticated user' };
      }

      // Check if user has access to the target tenant
      const { data: userInTenant, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', currentUser.user.id)
        .eq('tenant_id', tenantSlug)
        .single();

      if (error || !userInTenant) {
        return { success: false, error: 'User does not have access to this tenant' };
      }

      // Update user metadata with new tenant context
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          current_tenant_slug: tenantSlug 
        }
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const authService = new AuthService(); 