import { supabase } from './supabase';
import { User, Tenant } from '../types';

export interface AuthUser extends User {
  tenant?: Tenant;
}

export class AuthService {
  /**
   * Sign in user with tenant context
   */
  async signInWithTenant(email: string, password: string, tenantSlug?: string) {
    try {
      // 1. Sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'No user returned from authentication' };
      }

      // 2. Get user profile with tenant information
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          tenant:tenants(*)
        `)
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        return { user: null, error: 'Failed to load user profile' };
      }

      // 3. If tenant slug is provided, verify user belongs to that tenant
      if (tenantSlug && userProfile.tenant?.slug !== tenantSlug) {
        await supabase.auth.signOut();
        return { user: null, error: 'User does not belong to the specified tenant' };
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

      // 2. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            tenant_id: tenant.id,
          }
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'No user returned from sign up' };
      }

      // 3. Create user profile with tenant association
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          tenant_id: tenant.id,
          role,
        })
        .select(`
          *,
          tenant:tenants(*)
        `)
        .single();

      if (profileError) {
        return { user: null, error: 'Failed to create user profile' };
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
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authUser) {
        return { user: null, error: null };
      }

      // Get user profile with tenant information
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          tenant:tenants(*)
        `)
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        return { user: null, error: 'Failed to load user profile' };
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