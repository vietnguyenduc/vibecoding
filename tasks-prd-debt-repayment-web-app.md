# Task List: Debt and Repayment Web Application

## Relevant Files

- `src/main.tsx` - Main application entry point with Vite setup
- `src/App.tsx` - Root application component with routing
- `src/components/Layout/Layout.tsx` - Main layout component with navigation
- `src/components/Layout/Navigation.tsx` - Navigation menu component with SVG icons
- `src/pages/Dashboard/Dashboard.tsx` - Main dashboard page with metrics and charts
- `src/pages/Customers/CustomerList.tsx` - Customer list view with search and filters
- `src/pages/DataImport/TransactionImport.tsx` - Transaction data import component
- `src/pages/DataImport/CustomerImport.tsx` - Customer data import component
- `src/components/Charts/BalanceChart.tsx` - Chart component for balance visualization
- `src/components/Charts/CashFlowChart.tsx` - Waterfall chart for cash flow
- `src/components/DataTable/DataTable.tsx` - Reusable data table component
- `src/components/Export/ExportModal.tsx` - Export functionality modal
- `src/hooks/useAuth.ts` - Authentication hook using Supabase
- `src/hooks/useTransactions.ts` - Transaction data management hook
- `src/hooks/useCustomers.ts` - Customer data management hook
- `src/utils/validation.ts` - Data validation utilities
- `src/utils/excelExport.ts` - Excel export utilities using SheetJS
- `src/utils/dataCleaning.ts` - Data cleaning and formatting utilities
- `src/types/index.ts` - TypeScript type definitions
- `src/services/supabase.ts` - Supabase client configuration
- `src/services/api.ts` - API service functions
- `supabase/migrations/001_initial_schema.sql` - Database schema migration
- `supabase/migrations/002_seed_data.sql` - Initial seed data
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `package.json` - Project dependencies and scripts
- `src/components/Layout/Layout.test.tsx` - Unit tests for Layout component
- `src/pages/Dashboard/Dashboard.test.tsx` - Unit tests for Dashboard
- `src/utils/validation.test.ts` - Unit tests for validation utilities
- `src/utils/excelExport.test.ts` - Unit tests for export functionality

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Project Setup and Infrastructure
  - [ ] 1.1 Initialize Vite project with TypeScript and React
  - [ ] 1.2 Configure Tailwind CSS with custom theme for business UI
  - [ ] 1.3 Set up Supabase project and configure environment variables
  - [ ] 1.4 Create database schema with tables: users, customers, transactions, branches, bank_accounts, user_roles
  - [ ] 1.5 Configure React Router for navigation between pages
  - [ ] 1.6 Set up project structure with organized folders (components, pages, hooks, utils, services, types)
  - [ ] 1.7 Install and configure development dependencies (ESLint, Prettier, Jest, Testing Library)
  - [ ] 1.8 Create basic layout component with responsive design

- [ ] 2.0 Authentication and User Management System
  - [ ] 2.1 Implement Supabase Auth integration with JWT tokens
  - [ ] 2.2 Create authentication context and useAuth hook
  - [ ] 2.3 Build login/logout components with form validation
  - [ ] 2.4 Implement role-based access control (admin, branch manager, staff)
  - [ ] 2.5 Create protected route wrapper component
  - [ ] 2.6 Set up row-level security policies in Supabase
  - [ ] 2.7 Build user profile management component
  - [ ] 2.8 Implement session management and auto-logout functionality

- [ ] 3.0 Data Import and Management System
  - [ ] 3.1 Create transaction import component with text area for Google Sheets/Excel data
  - [ ] 3.2 Implement contentEditable table for direct data editing
  - [ ] 3.3 Build data cleaning utilities (remove quotes, commas, auto-format dates)
  - [ ] 3.4 Create validation system with error highlighting (red fill for invalid data)
  - [ ] 3.5 Implement "Add New Customer" functionality for unmatched customer names
  - [ ] 3.6 Build customer import component with bulk upload support
  - [ ] 3.7 Create Excel/CSV file upload functionality using SheetJS
  - [ ] 3.8 Implement real-time data validation with immediate error feedback
  - [ ] 3.9 Build transaction and customer CRUD operations with Supabase

- [ ] 4.0 Dashboard and Analytics Implementation
  - [ ] 4.1 Create main dashboard layout with responsive grid system
  - [ ] 4.2 Implement key metrics cards (total outstanding balance, period comparison)
  - [ ] 4.3 Build balance breakdown by branch using card format
  - [ ] 4.4 Create balance by bank account column chart using Chart.js/Recharts
  - [ ] 4.5 Implement cash flow waterfall chart for time-based analysis
  - [ ] 4.6 Add time range slicer buttons (Day/Week/Month/Quarter)
  - [ ] 4.7 Create recent transactions list with configurable display count
  - [ ] 4.8 Build top customers list with highest outstanding balance
  - [ ] 4.9 Implement real-time data updates using Supabase subscriptions
  - [ ] 4.10 Add loading states and error handling for dashboard components

- [ ] 5.0 Customer Management System
  - [ ] 5.1 Create customer list view with sortable columns (ID, Name, Phone, Contact, Balance, Last Transaction)
  - [ ] 5.2 Implement action buttons (3-line icon) for each customer row
  - [ ] 5.3 Build customer transaction history popup with detailed information
  - [ ] 5.4 Add conditional formatting (red for negative, green for positive amounts)
  - [ ] 5.5 Implement free-text search across multiple fields with auto-suggestions
  - [ ] 5.6 Create date range filter with calendar dropdown
  - [ ] 5.7 Build customer detail view with edit functionality
  - [ ] 5.8 Implement customer creation and editing forms with validation
  - [ ] 5.9 Add pagination for large customer datasets

- [ ] 6.0 Reporting and Export Functionality
  - [ ] 6.1 Create export modal with multiple export options
  - [ ] 6.2 Implement Key Metrics Summary export in table format
  - [ ] 6.3 Build transaction export with filtering capabilities
  - [ ] 6.4 Create customer balance export with historical data option
  - [ ] 6.5 Implement Excel (.xlsx) generation with multiple sheets using SheetJS
  - [ ] 6.6 Add export filtering (selected data vs all data)
  - [ ] 6.7 Create export progress indicators and error handling
  - [ ] 6.8 Implement export scheduling for automated reports

- [ ] 7.0 Testing, Deployment, and Documentation
  - [ ] 7.1 Write unit tests for all utility functions and components
  - [ ] 7.2 Create integration tests for data import and export functionality
  - [ ] 7.3 Perform end-to-end testing of complete user workflows
  - [ ] 7.4 Optimize application performance (code splitting, lazy loading)
  - [ ] 7.5 Configure Vercel deployment with environment variables
  - [ ] 7.6 Set up custom domain with SSL certificate
  - [ ] 7.7 Create user documentation and training materials
  - [ ] 7.8 Implement monitoring and error tracking
  - [ ] 7.9 Conduct user acceptance testing and gather feedback 