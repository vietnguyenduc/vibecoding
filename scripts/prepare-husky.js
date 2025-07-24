// scripts/prepare-husky.js
if (!process.env.VERCEL) {
  require('child_process').execSync('npx husky install', { stdio: 'inherit' });
} 