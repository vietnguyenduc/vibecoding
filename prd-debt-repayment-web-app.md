# Product Requirements Document: Debt and Repayment Web Application

## 1. Introduction/Overview

The Debt and Repayment Web Application is a comprehensive cloud-based system designed for small businesses to track customer credit terms, debt increases, repayments, and outstanding balances across multiple branches and bank accounts. The system provides real-time data import capabilities, interactive dashboards, detailed customer management, and comprehensive reporting to help businesses maintain accurate financial records and make informed decisions about customer credit management.

**Problem Statement:** Small businesses struggle to efficiently track customer debt, manage multiple payment channels, and generate accurate financial reports across different branches and bank accounts. Manual tracking leads to errors, delays in identifying overdue accounts, and difficulty in maintaining up-to-date customer balance information.

**Goal:** Create a user-friendly, cloud-based web application that automates debt tracking, provides real-time insights, and enables efficient customer relationship management for small businesses with customer credit terms.

## 2. Goals

1. **Streamline Data Import:** Enable efficient bulk import of transaction data from Excel/CSV files and Google Sheets with automated data cleaning and validation
2. **Real-time Dashboard:** Provide instant visibility into outstanding balances, cash flow trends, and key financial metrics across all branches and bank accounts
3. **Customer Management:** Maintain comprehensive customer profiles with transaction history and outstanding balance tracking
4. **Multi-user Access:** Support role-based access for different user types (admin, branch manager, staff) with appropriate permissions
5. **Comprehensive Reporting:** Generate detailed financial reports and export data in Excel format for further analysis
6. **Error Prevention:** Implement validation rules and error highlighting to prevent data entry mistakes
7. **Scalable Architecture:** Design for cloud deployment with ability to handle growing transaction volumes

## 3. User Stories

### Primary User Stories

**As a business owner/manager,**
- I want to see the total outstanding balance across all customers so that I can understand the company's financial position
- I want to view balance breakdowns by branch and bank account so that I can identify which areas need attention
- I want to export comprehensive reports so that I can share financial data with stakeholders

**As a branch manager,**
- I want to import daily transaction data quickly so that I can keep customer records up-to-date
- I want to view customer transaction history so that I can make informed decisions about extending credit
- I want to search and filter customer data so that I can find specific information efficiently

**As a staff member,**
- I want to add new customers easily so that I can onboard new clients without delays
- I want to see validation errors immediately so that I can correct data entry mistakes before saving
- I want to access customer contact information so that I can reach out about overdue payments

**As a financial analyst,**
- I want to view cash flow trends over time so that I can identify patterns and make projections
- I want to export transaction data so that I can perform detailed analysis in external tools
- I want to filter data by date ranges so that I can focus on specific time periods

## 4. Functional Requirements

### 4.1 Data Import System

1. **Transaction Import**
   - The system must allow users to paste transaction data from Google Sheets or Excel into a text area
   - The system must support direct table editing with contentEditable functionality
   - The system must automatically clean data by removing quotes and commas from text fields
   - The system must auto-format dates (e.g., "15/07" → "15/07/2025")
   - The system must validate required fields: Date, Customer Name, Debt Increase, Debt Decrease, Branch, Bank Account, Note
   - The system must highlight invalid data with red fill for: future dates, dates older than 5 years, invalid names (containing 'z', 'j', or numbers), negative amounts
   - The system must provide an "Add New Customer" button for unmatched customer names

2. **Customer Import**
   - The system must allow bulk import of customer data with fields: Customer ID, Customer Name, Customer Address, Phone Number, How to Contact
   - The system must apply the same data cleaning and validation processes as transaction import
   - The system must support Excel/CSV file uploads for both transactions and customers

### 4.2 Dashboard and Analytics

3. **Key Metrics Display**
   - The system must display total outstanding balance with comparison to previous period
   - The system must show balance breakdown by branch in card format
   - The system must display balance by bank account in column chart format
   - The system must present cash flow over time using waterfall charts
   - The system must calculate balance as: Initial + Increase - Decrease
   - The system must provide time range slicer buttons (Day/Week/Month/Quarter)

4. **Detailed Lists**
   - The system must display the 5 most recent transactions
   - The system must show top 5 customers with highest outstanding balance
   - The system must allow users to select display count (5, 10, 15, 20 items) for both lists

### 4.3 Customer Management

5. **Customer List View**
   - The system must display customer data in columns: Customer ID, Customer Name, Phone Number, Contact Method, Outstanding Balance (sortable), Last Transaction Date (sortable)
   - The system must provide action buttons (3-line icon) for each customer
   - The system must show customer transaction history in pop-up windows with: customer info, amount (+/-), date, balance, branch, bank
   - The system must apply conditional formatting: red for negative amounts, green for positive amounts
   - The system must support sorting on all relevant fields

6. **Search and Filter**
   - The system must provide free-text search across: ID, name, phone, transaction date, branch
   - The system must offer search suggestions for full matches
   - The system must include date range selection with calendar dropdown
   - The system must support filtering by date ranges (from...to)

### 4.4 Reporting and Export

7. **Export Functionality**
   - The system must allow export of Key Metrics Summary in table format
   - The system must support export of all transactions
   - The system must enable export of all customer balances
   - The system must generate Excel (.xlsx) files with multiple sheets when multiple options are selected
   - The system must provide option to download selected data (based on filters) or all data
   - The system must include checkbox option to include historical data per customer

### 4.5 User Interface and Navigation

8. **Navigation System**
   - The system must provide menu items: Homepage, Customer List, Branches, Bank Account
   - The system must include SVG icons for each menu item
   - The system must support responsive design for desktop, tablet, and mobile access

### 4.6 User Management and Security

9. **Multi-user Support**
   - The system must support role-based access control with different permission levels
   - The system must provide user authentication and session management
   - The system must allow different user types: admin, branch manager, staff

### 4.7 Internationalization (i18n)

10. **Multi-language Support**
    - The system must support English and Vietnamese languages
    - The system must provide a language switcher component for users to change languages
    - The system must automatically detect user's preferred language from browser settings
    - The system must persist language preference in local storage
    - The system must provide language-specific formatting for:
      - Currency: USD ($) for English, VND (₫) for Vietnamese
      - Dates: US format (MM/DD/YYYY) for English, Vietnamese format (DD/MM/YYYY) for Vietnamese
      - Numbers: US commas for English, Vietnamese dots for Vietnamese
    - The system must translate all user-facing content including:
      - Navigation menus and labels
      - Form fields and validation messages
      - Dashboard metrics and charts
      - Error messages and notifications
      - Export/import functionality
      - User roles and permissions
    - The system must update HTML lang attribute based on selected language
    - The system must support right-to-left (RTL) language preparation for future expansion

## 5. Non-Goals (Out of Scope)

1. **Advanced Accounting Features:** The system will not include general ledger, double-entry bookkeeping, or tax calculation features
2. **Payment Processing:** The system will not process actual payments or integrate with payment gateways
3. **Customer Portal:** The system will not provide customer-facing interfaces for self-service
4. **Advanced Analytics:** The system will not include predictive analytics, machine learning, or complex financial modeling
5. **Mobile App:** The system will be web-based only, no native mobile applications
6. **Third-party Integrations:** The system will not integrate with external accounting software, banking APIs, or CRM systems in the initial version
7. **Multi-currency Support:** The system will handle single currency per language (USD for English, VND for Vietnamese)
8. **Audit Trail:** The system will not include comprehensive audit logging of all user actions

## 6. Technical Stack & Architecture

### 6.1 Frontend Technology
- **Framework:** Vite (for fast development and optimized builds)
- **UI Framework:** Tailwind CSS (utility-first CSS framework for responsive design)
- **Language:** JavaScript/TypeScript
- **State Management:** React Context API or Zustand (lightweight state management)
- **Routing:** React Router (for single-page application navigation)

### 6.2 Backend & Database
- **Platform:** Supabase (PostgreSQL database with built-in authentication and real-time features)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (built-in user management with role-based access)
- **API:** Supabase REST API and real-time subscriptions
- **File Storage:** Supabase Storage (for Excel/CSV file uploads)

### 6.3 Deployment & Hosting
- **Platform:** Vercel (optimized for frontend deployment with serverless functions)
- **Domain:** Custom domain with SSL certificate
- **CDN:** Global content delivery network for fast loading
- **Environment:** Production, staging, and development environments

### 6.4 Additional Technologies
- **Charts/Visualization:** Chart.js or Recharts (flexible based on implementation needs)
- **File Processing:** SheetJS/xlsx (for Excel/CSV handling)
- **Authentication:** JWT tokens (via Supabase Auth)
- **Form Handling:** React Hook Form (for efficient form management)
- **Data Validation:** Zod or Yup (for schema validation)
- **Internationalization:** i18next and react-i18next (for multi-language support)

## 7. Design Considerations

### 7.1 User Interface
- **Modern Web Design:** Clean, professional interface suitable for business use
- **Responsive Layout:** Must work effectively on desktop, tablet, and mobile devices using Tailwind CSS
- **Data Visualization:** Use of charts and graphs for financial data presentation
- **Color Coding:** Consistent use of red/green for negative/positive values
- **Intuitive Navigation:** Clear menu structure with descriptive SVG icons

### 7.2 User Experience
- **Progressive Disclosure:** Show essential information first, with options to drill down
- **Real-time Validation:** Immediate feedback on data entry errors
- **Bulk Operations:** Support for importing and processing large datasets efficiently
- **Search and Filter:** Powerful search capabilities with auto-suggestions
- **Export Flexibility:** Multiple export options with customizable content

### 7.3 Technical Architecture
- **Component-Based Design:** Modular React components for maintainability
- **API-First Approach:** RESTful API design with Supabase integration
- **Real-time Updates:** Live data synchronization using Supabase subscriptions
- **Progressive Web App:** Offline capabilities and app-like experience
- **Performance Optimization:** Code splitting, lazy loading, and efficient data fetching

## 8. Database Schema Design

### 8.1 Core Tables
- **users:** User accounts and authentication (managed by Supabase Auth)
- **customers:** Customer information and contact details
- **transactions:** Financial transactions with debt increases/decreases
- **branches:** Branch information and management
- **bank_accounts:** Bank account details and balances
- **user_roles:** Role-based access control mapping

### 8.2 Key Relationships
- Transactions linked to customers, branches, and bank accounts
- Users assigned to specific roles and branches
- Real-time subscriptions for dashboard updates
- Row-level security policies for data access control

## 9. Success Metrics

1. **User Adoption:** 90% of target users actively using the system within 3 months of deployment
2. **Data Accuracy:** Reduce data entry errors by 80% compared to manual processes
3. **Time Savings:** Reduce time spent on debt tracking and reporting by 70%
4. **System Performance:** Dashboard loads within 3 seconds, data imports complete within 30 seconds
5. **User Satisfaction:** Achieve 4.5/5 user satisfaction rating in post-deployment survey
6. **Data Completeness:** 95% of customer transactions captured in the system
7. **Report Generation:** Reduce time to generate monthly reports from days to minutes

## 10. Development Phases

### Phase 1: Core Infrastructure (Weeks 1-2)
- Set up Vite project with Tailwind CSS
- Configure Supabase project and database schema
- Implement authentication system
- Create basic layout and navigation

### Phase 2: Data Management (Weeks 3-4)
- Implement customer CRUD operations
- Build transaction import system
- Create data validation and error handling
- Develop search and filter functionality

### Phase 3: Dashboard & Analytics (Weeks 5-6)
- Build interactive dashboard with charts
- Implement real-time data updates
- Create export functionality
- Add responsive design optimizations

### Phase 4: Testing & Deployment (Weeks 7-8)
- Comprehensive testing and bug fixes
- Performance optimization
- Deploy to Vercel
- User training and documentation

## 11. Open Questions

1. **Data Migration:** What existing systems or data sources need to be migrated to the new system?
2. **Compliance Requirements:** Are there any specific regulatory or compliance requirements for financial data storage?
3. **Backup Frequency:** How frequently should automated backups be performed?
4. **User Training:** What level of user training will be required for system adoption?
5. **Future Enhancements:** What features might be needed in future versions (e.g., SMS notifications, advanced reporting)?
6. **Integration Roadmap:** What external systems might need integration in future phases?
7. **Data Volume Limits:** What are the expected maximum limits for customers, transactions, and concurrent users?
8. **Customization Needs:** Are there any business-specific customizations required beyond the standard features?

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Prepared By:** AI Assistant  
**Review By:** [Stakeholder Name] 