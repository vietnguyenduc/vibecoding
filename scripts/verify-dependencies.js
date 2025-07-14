#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

// Critical dependencies that must be installed
const criticalDependencies = {
  production: [
    'react',
    'react-dom',
    'react-router-dom',
    '@supabase/supabase-js',
    'i18next',
    'react-i18next',
    'i18next-browser-languagedetector',
    'i18next-http-backend',
    'recharts',
    'xlsx',
    'date-fns',
    'clsx'
  ],
  development: [
    '@types/react',
    '@types/react-dom',
    '@types/jest',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    '@vitejs/plugin-react',
    'eslint',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-import',
    'eslint-plugin-prettier',
    'prettier',
    'jest',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    '@testing-library/react-hooks',
    'jest-environment-jsdom',
    'typescript',
    'vite',
    'tailwindcss',
    'autoprefixer',
    'postcss'
  ]
};

// Required configuration files
const requiredConfigFiles = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  '.eslintrc.cjs',
  'jest.config.js',
  '.prettierrc',
  '.prettierignore',
  '.gitignore',
  'env.example'
];

// Required source directories and files
const requiredSourceFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'src/index.css',
  'src/vite-env.d.ts',
  'src/setupTests.ts',
  'src/i18n/index.ts',
  'src/i18n/locales/en.json',
  'src/i18n/locales/vi.json',
  'src/services/supabase.ts',
  'src/hooks/useAuth.ts',
  'src/hooks/useLocalStorage.ts',
  'src/hooks/useDebounce.ts',
  'src/hooks/useI18n.ts',
  'src/utils/validation.ts',
  'src/utils/formatting.ts',
  'src/utils/constants.ts',
  'src/types/index.ts',
  'src/services/api.ts'
];

// Required directories
const requiredDirectories = [
  'src/components',
  'src/pages',
  'src/hooks',
  'src/utils',
  'src/services',
  'src/types',
  'src/i18n/locales',
  'src/config',
  'docs',
  'supabase/migrations',
  'scripts'
];

function checkNodeVersion() {
  log.header('Checking Node.js Version');
  
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 16) {
    log.success(`Node.js version: ${nodeVersion} (✓ Compatible)`);
  } else {
    log.error(`Node.js version: ${nodeVersion} (✗ Requires Node.js 16 or higher)`);
    return false;
  }
  
  return true;
}

function checkPackageManager() {
  log.header('Checking Package Manager');
  
  try {
    // Check if package-lock.json exists (npm) or yarn.lock exists (yarn)
    const hasNpmLock = fs.existsSync('package-lock.json');
    const hasYarnLock = fs.existsSync('yarn.lock');
    const hasPnpmLock = fs.existsSync('pnpm-lock.yaml');
    
    if (hasNpmLock) {
      log.success('Package manager: npm (package-lock.json found)');
    } else if (hasYarnLock) {
      log.success('Package manager: yarn (yarn.lock found)');
    } else if (hasPnpmLock) {
      log.success('Package manager: pnpm (pnpm-lock.yaml found)');
    } else {
      log.warning('No lock file found. Run npm install to create package-lock.json');
    }
    
    return true;
  } catch (error) {
    log.error(`Error checking package manager: ${error.message}`);
    return false;
  }
}

function checkDependencies() {
  log.header('Checking Dependencies');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    let allGood = true;
    
    // Check production dependencies
    log.info('Checking production dependencies...');
    for (const dep of criticalDependencies.production) {
      if (dependencies[dep]) {
        log.success(`${dep}: ${dependencies[dep]}`);
      } else {
        log.error(`Missing production dependency: ${dep}`);
        allGood = false;
      }
    }
    
    // Check development dependencies
    log.info('Checking development dependencies...');
    for (const dep of criticalDependencies.development) {
      if (devDependencies[dep]) {
        log.success(`${dep}: ${devDependencies[dep]}`);
      } else {
        log.error(`Missing development dependency: ${dep}`);
        allGood = false;
      }
    }
    
    return allGood;
  } catch (error) {
    log.error(`Error checking dependencies: ${error.message}`);
    return false;
  }
}

function checkConfigFiles() {
  log.header('Checking Configuration Files');
  
  let allGood = true;
  
  for (const file of requiredConfigFiles) {
    if (fs.existsSync(file)) {
      log.success(`${file} exists`);
    } else {
      log.error(`Missing configuration file: ${file}`);
      allGood = false;
    }
  }
  
  return allGood;
}

function checkSourceFiles() {
  log.header('Checking Source Files');
  
  let allGood = true;
  
  for (const file of requiredSourceFiles) {
    if (fs.existsSync(file)) {
      log.success(`${file} exists`);
    } else {
      log.error(`Missing source file: ${file}`);
      allGood = false;
    }
  }
  
  return allGood;
}

function checkDirectories() {
  log.header('Checking Required Directories');
  
  let allGood = true;
  
  for (const dir of requiredDirectories) {
    if (fs.existsSync(dir)) {
      log.success(`${dir}/ exists`);
    } else {
      log.error(`Missing directory: ${dir}/`);
      allGood = false;
    }
  }
  
  return allGood;
}

function checkTypeScriptConfig() {
  log.header('Checking TypeScript Configuration');
  
  try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    
    // Check for strict mode
    if (tsConfig.compilerOptions?.strict) {
      log.success('TypeScript strict mode is enabled');
    } else {
      log.warning('TypeScript strict mode is not enabled');
    }
    
    // Check for path mapping
    if (tsConfig.compilerOptions?.paths) {
      log.success('TypeScript path mapping is configured');
    } else {
      log.warning('TypeScript path mapping is not configured');
    }
    
    return true;
  } catch (error) {
    log.error(`Error checking TypeScript config: ${error.message}`);
    return false;
  }
}

function checkEnvironmentSetup() {
  log.header('Checking Environment Setup');
  
  let allGood = true;
  
  // Check if .env file exists
  if (fs.existsSync('.env')) {
    log.success('.env file exists');
  } else if (fs.existsSync('.env.local')) {
    log.success('.env.local file exists');
  } else {
    log.warning('No .env file found. Copy env.example to .env and configure your environment variables');
  }
  
  // Check if env.example exists
  if (fs.existsSync('env.example')) {
    log.success('env.example exists');
  } else {
    log.error('env.example is missing');
    allGood = false;
  }
  
  return allGood;
}

function checkBuildProcess() {
  log.header('Checking Build Process');
  
  try {
    // Try to run type checking
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    log.success('TypeScript compilation check passed');
  } catch (error) {
    log.error('TypeScript compilation check failed. Run "npm run type-check" for details');
    return false;
  }
  
  return true;
}

function generateHealthReport(results) {
  log.header('Health Check Summary');
  
  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(Boolean).length;
  const failedChecks = totalChecks - passedChecks;
  
  console.log(`\n${colors.bold}Results:${colors.reset}`);
  console.log(`✅ Passed: ${passedChecks}/${totalChecks}`);
  console.log(`❌ Failed: ${failedChecks}/${totalChecks}`);
  
  if (failedChecks === 0) {
    log.success('All checks passed! Your project is ready for development.');
  } else {
    log.error(`${failedChecks} check(s) failed. Please fix the issues above before proceeding.`);
    console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
    console.log('1. Run "npm install" to install missing dependencies');
    console.log('2. Copy env.example to .env and configure your environment variables');
    console.log('3. Run "npm run type-check" to check for TypeScript errors');
    console.log('4. Run "npm run lint" to check for linting issues');
  }
  
  return failedChecks === 0;
}

function main() {
  console.log(`${colors.bold}${colors.blue}🔍 Dependency Verification and Health Check${colors.reset}\n`);
  
  const results = {
    nodeVersion: checkNodeVersion(),
    packageManager: checkPackageManager(),
    dependencies: checkDependencies(),
    configFiles: checkConfigFiles(),
    sourceFiles: checkSourceFiles(),
    directories: checkDirectories(),
    typescriptConfig: checkTypeScriptConfig(),
    environmentSetup: checkEnvironmentSetup(),
    buildProcess: checkBuildProcess()
  };
  
  const isHealthy = generateHealthReport(results);
  
  process.exit(isHealthy ? 0 : 1);
}

// Run the verification
main(); 