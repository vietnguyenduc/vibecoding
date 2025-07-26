# Debt and Repayment Web Application

A comprehensive web application for managing debt and repayment tracking with full Vietnamese language support. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Core Functionality

- **Authentication System**: Secure login/logout with role-based access control
- **Dashboard Analytics**: Real-time metrics and visualizations
- **Customer Management**: Complete CRUD operations with advanced search and filtering
- **Transaction Management**: Import, track, and manage financial transactions
- **Reporting System**: Comprehensive reports with export functionality
- **Data Import**: Bulk import from Excel/CSV files and Google Sheets

### Technical Features

- **Bilingual Support**: Full English and Vietnamese language support
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live data synchronization with Supabase
- **Advanced Filtering**: Date ranges, search, sorting, and grouping
- **Export Capabilities**: Excel and CSV export with custom options
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom business theme
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Hooks with Context API
- **Internationalization**: react-i18next
- **Testing**: Jest, React Testing Library
- **Build Tool**: Vite
- **Linting**: ESLint, Prettier

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Modern web browser

## 🏢 Multi-Tenant Setup

This application supports **multi-tenancy** for serving multiple clients with complete data isolation. Each tenant (client) has their own set of users, branches, customers, and transactions.

### Quick Multi-Tenant Setup

1. **Apply multi-tenant migrations**:

   ```bash
   npx supabase db push
   ```

2. **Create your first tenant**:

   ```sql
   INSERT INTO public.tenants (name, slug, domain) VALUES
   ('Your Company Name', 'your-company', 'yourcompany.com');
   ```

3. **Associate users with tenants** during signup/signin

For detailed multi-tenant setup instructions, see: [docs/MULTI_TENANT_SETUP.md](docs/MULTI_TENANT_SETUP.md)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vibecoding
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your Supabase credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your Supabase project details:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

Run the Supabase migrations to set up the database schema:

```bash
npx supabase db push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout and navigation
│   └── UI/             # Common UI components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard and analytics
│   ├── Customers/      # Customer management
│   ├── Reports/        # Reporting and export
│   └── DataImport/     # Data import functionality
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── i18n/               # Internationalization
└── styles/             # Global styles and themes
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 🌐 Internationalization

The application supports both English and Vietnamese languages. Language files are located in `src/i18n/locales/`.

### Adding New Translations

1. Add keys to both `en.json` and `vi.json`
2. Use the `useTranslation` hook in components
3. Follow the nested structure for organization

## 🗄️ Database Schema

### Core Tables

- **users**: User accounts and authentication
- **customers**: Customer information and balances
- **transactions**: Financial transaction records
- **branches**: Branch/office information
- **bank_accounts**: Bank account details

### Key Features

- Row Level Security (RLS) policies
- Real-time subscriptions
- Automatic audit trails
- Foreign key relationships

## 🔐 Authentication & Authorization

### User Roles

- **Admin**: Full system access
- **Branch Manager**: Branch-specific access
- **Staff**: Limited access based on permissions

### Security Features

- JWT token authentication
- Role-based access control
- Session management
- Secure password handling

## 📊 Reporting System

### Available Reports

1. **Key Metrics Report**: Dashboard overview
2. **Customer Balance Report**: Customer analysis
3. **Transaction Report**: Transaction analysis
4. **Cash Flow Report**: Cash flow tracking

### Export Options

- Excel (.xlsx) with multiple sheets
- CSV format
- Customizable content (headers, charts, details)
- Progress tracking and error handling

## 🎨 UI/UX Features

### Design System

- **Apple-Style Design**: Clean, minimal, and professional interface
- **Typography**: Inter font family with optimized weights for excellent readability
- **Color Palette**: Subtle grays, clean whites, and strategic use of Apple blue
- **Component Patterns**: Consistent buttons, cards, and interactive elements
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Accessibility**: High contrast ratios, proper focus states, screen reader support

For detailed design system documentation, see [DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)

### Components

- Loading states and error boundaries
- Modal dialogs and notifications
- Data tables with sorting/filtering
- Form validation and feedback

## 🧪 Testing

### Test Structure

- Unit tests for utilities and hooks
- Component tests with React Testing Library
- Integration tests for data flow
- E2E testing setup

### Running Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Vercel**: Recommended for React applications
- **Netlify**: Alternative static hosting
- **Supabase**: Backend hosting included

### Environment Variables

Ensure all required environment variables are set in production:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📝 API Documentation

### Supabase Integration

The application uses Supabase for:

- Database operations
- Authentication
- Real-time subscriptions
- File storage

### Key Services

- `databaseService`: Database operations
- `authService`: Authentication management
- `importService`: Data import functionality

## 🔧 Configuration

### Tailwind Configuration

Custom business theme with:

- Primary color palette
- Typography scale
- Spacing system
- Component variants

### Vite Configuration

- React plugin
- Path aliases
- Environment variables
- Build optimization

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection**: Verify environment variables
2. **Build Errors**: Check TypeScript types
3. **Import Issues**: Ensure file paths are correct
4. **Authentication**: Clear browser cache and cookies

### Debug Mode

Enable debug logging by setting:

```env
VITE_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 🗺️ Roadmap

### Planned Features

- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] API rate limiting
- [ ] Advanced reporting templates
- [ ] Multi-tenant support
- [ ] Audit logging
- [ ] Backup and recovery
- [ ] Performance monitoring

### Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added reporting and export features
- **v1.2.0**: Enhanced customer management
- **v1.3.0**: Improved UI/UX and performance

---

**Built with ❤️ using modern web technologies**
