/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_GOOGLE_ANALYTICS_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 