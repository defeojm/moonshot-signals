// debug-api-url.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging API URL configuration...\n');

// Check environment variables
console.log('1️⃣ Environment Variables:');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check .env files
console.log('\n2️⃣ Checking .env files:');
const envFiles = ['.env', '.env.local', '.env.production', '.env.production.local'];
envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`\n📄 ${file}:`);
    const content = fs.readFileSync(filePath, 'utf8');
    const apiUrl = content.match(/NEXT_PUBLIC_API_URL=(.+)/);
    if (apiUrl) {
      console.log(`   NEXT_PUBLIC_API_URL = ${apiUrl[1]}`);
    }
  } else {
    console.log(`❌ ${file} - not found`);
  }
});

// Check next.config.js
console.log('\n3️⃣ Checking next.config.js:');
const nextConfigPath = path.join(__dirname, 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ next.config.js exists');
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  if (content.includes('API_URL') || content.includes('api')) {
    console.log('   Contains API-related configuration');
  }
} else {
  console.log('❌ next.config.js not found');
}

// Search for hardcoded API URLs in src files
console.log('\n4️⃣ Searching for hardcoded API URLs:');
function searchInDirectory(dir, searchTerm) {
  const results = [];
  
  function search(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const files = fs.readdirSync(currentDir);
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
        search(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('api/auth/login') || content.includes('API_URL') || content.includes('getmoonshots.com')) {
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.includes('api/auth/login') || line.includes('API_URL') || line.includes('getmoonshots.com')) {
              results.push({
                file: filePath.replace(__dirname, '.'),
                line: index + 1,
                content: line.trim()
              });
            }
          });
        }
      }
    });
  }
  
  search(dir);
  return results;
}

const srcResults = searchInDirectory(path.join(__dirname, 'src'));
const libResults = searchInDirectory(path.join(__dirname, 'lib'));
const utilsResults = searchInDirectory(path.join(__dirname, 'utils'));
const configResults = searchInDirectory(path.join(__dirname, 'config'));

const allResults = [...srcResults, ...libResults, ...utilsResults, ...configResults];

if (allResults.length > 0) {
  console.log(`\n📍 Found ${allResults.length} references:`);
  allResults.forEach(result => {
    console.log(`\n   File: ${result.file}`);
    console.log(`   Line ${result.line}: ${result.content}`);
  });
} else {
  console.log('❌ No hardcoded API URLs found in common directories');
}

// Check the built .next folder
console.log('\n5️⃣ Checking if rebuild is needed:');
const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');
if (fs.existsSync(buildIdPath)) {
  const buildTime = fs.statSync(buildIdPath).mtime;
  console.log(`✅ Last build: ${buildTime}`);
  
  // Check if .env.production was modified after build
  const envProdPath = path.join(__dirname, '.env.production');
  if (fs.existsSync(envProdPath)) {
    const envModTime = fs.statSync(envProdPath).mtime;
    if (envModTime > buildTime) {
      console.log('⚠️  .env.production was modified after last build - REBUILD NEEDED!');
    } else {
      console.log('✅ Build is up to date with .env.production');
    }
  }
} else {
  console.log('❌ No build found');
}

console.log('\n✅ Debug complete!');