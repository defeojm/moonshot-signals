// fix-frontend-api-urls.js
// Run this in your frontend directory to find and fix API URL issues

const fs = require('fs').promises;
const path = require('path');

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

// Patterns to look for
const problemPatterns = [
    /getmoonshots\.com/gi,
    /www\.getmoonshots\.com/gi,
    /http:\/\/localhost:\d+/gi,
    /https?:\/\/[^\/]*\/api/gi
];

// Files to check
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const excludeDirs = ['node_modules', '.next', 'dist', 'build', '.git'];

async function findFiles(dir, files = []) {
    try {
        const items = await fs.readdir(dir, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            
            if (item.isDirectory()) {
                if (!excludeDirs.includes(item.name)) {
                    await findFiles(fullPath, files);
                }
            } else if (fileExtensions.some(ext => item.name.endsWith(ext))) {
                files.push(fullPath);
            }
        }
    } catch (error) {
        // Ignore permission errors
    }
    
    return files;
}

async function checkFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const issues = [];
        
        problemPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    // Find line number
                    const lines = content.split('\n');
                    const lineNum = lines.findIndex(line => line.includes(match)) + 1;
                    
                    issues.push({
                        match,
                        lineNum,
                        pattern: pattern.toString()
                    });
                });
            }
        });
        
        // Also check for fetch/axios calls
        const apiCallPatterns = [
            /fetch\s*\(\s*['"`]([^'"`]+)['"`]/g,
            /axios\.[get|post|put|delete]+\s*\(\s*['"`]([^'"`]+)['"`]/g,
            /api\.[get|post|put|delete]+\s*\(\s*['"`]([^'"`]+)['"`]/g
        ];
        
        apiCallPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const url = match[1];
                if (url.includes('api') && !url.includes('process.env')) {
                    const lineNum = content.substring(0, match.index).split('\n').length;
                    issues.push({
                        match: match[0],
                        url,
                        lineNum,
                        type: 'api-call'
                    });
                }
            }
        });
        
        return issues.length > 0 ? { filePath, issues } : null;
    } catch (error) {
        return null;
    }
}

async function createEnvFile() {
    const envContent = `# API Configuration
NEXT_PUBLIC_API_URL=https://moonshot-signals-backend-production.up.railway.app

# Add any other environment variables here
`;

    try {
        // Check if .env.local exists
        await fs.access('.env.local');
        log.warn('.env.local already exists');
        
        // Read existing content
        const existing = await fs.readFile('.env.local', 'utf8');
        if (!existing.includes('NEXT_PUBLIC_API_URL')) {
            // Append to existing file
            await fs.appendFile('.env.local', '\n' + envContent);
            log.success('Added NEXT_PUBLIC_API_URL to .env.local');
        } else {
            log.info('NEXT_PUBLIC_API_URL already in .env.local');
        }
    } catch {
        // File doesn't exist, create it
        await fs.writeFile('.env.local', envContent);
        log.success('Created .env.local with API configuration');
    }
    
    // Also create .env.production
    try {
        await fs.writeFile('.env.production', envContent);
        log.success('Created .env.production');
    } catch (error) {
        log.error(`Failed to create .env.production: ${error.message}`);
    }
}

async function createApiConfig() {
    const apiConfigContent = `// utils/api-config.js
// Centralized API configuration

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moonshot-signals-backend-production.up.railway.app';

// Helper to build API URLs
export const getApiUrl = (endpoint) => {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : \`/\${endpoint}\`;
    return \`\${API_URL}\${path}\`;
};

// API endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SIGNUP: '/api/auth/signup',
    
    // Admin
    MEMBERS: '/api/members',
    STATS: '/api/stats',
    
    // Trades & Signals
    TRADES: '/api/trades',
    SIGNALS: '/api/signals',
    SIGNALS_ALL: '/api/signals/all',
    PUBLISH_SIGNAL: '/api/signals/publish',
    
    // Settings
    USER_SETTINGS: '/api/settings',
    NOTIFICATIONS: '/api/settings/notifications',
    
    // Chat
    CHAT_MESSAGES: '/api/chat/messages',
};

export default API_URL;
`;

    try {
        // Create utils directory if it doesn't exist
        await fs.mkdir('utils', { recursive: true });
        await fs.writeFile('utils/api-config.js', apiConfigContent);
        log.success('Created utils/api-config.js');
    } catch (error) {
        log.error(`Failed to create api-config.js: ${error.message}`);
    }
}

async function main() {
    log.info('🔍 Scanning frontend code for API URL issues...\n');
    
    // Get all files
    const files = await findFiles('.');
    log.info(`Found ${files.length} files to check`);
    
    // Check each file
    const problemFiles = [];
    for (const file of files) {
        const result = await checkFile(file);
        if (result) {
            problemFiles.push(result);
        }
    }
    
    // Report findings
    if (problemFiles.length > 0) {
        log.warn(`\nFound issues in ${problemFiles.length} files:\n`);
        
        problemFiles.forEach(({ filePath, issues }) => {
            console.log(`📄 ${colors.yellow}${filePath}${colors.reset}`);
            issues.forEach(issue => {
                console.log(`   Line ${issue.lineNum}: ${issue.match}`);
                if (issue.url) {
                    console.log(`   API call to: ${issue.url}`);
                }
            });
            console.log('');
        });
        
        // Show specific files that need attention
        const signalFiles = problemFiles.filter(f => 
            f.filePath.toLowerCase().includes('signal') || 
            f.filePath.toLowerCase().includes('admin')
        );
        
        if (signalFiles.length > 0) {
            log.warn('\n📍 Signal-related files that need fixing:');
            signalFiles.forEach(f => console.log(`   - ${f.filePath}`));
        }
    } else {
        log.success('No hardcoded API URLs found!');
    }
    
    // Create configuration files
    log.info('\n🔧 Setting up API configuration...\n');
    await createEnvFile();
    await createApiConfig();
    
    // Instructions
    console.log(`\n${colors.blue}📝 Next Steps:${colors.reset}`);
    console.log('1. Update your API calls to use the configuration:');
    console.log(`   ${colors.yellow}import { getApiUrl, API_ENDPOINTS } from './utils/api-config';${colors.reset}`);
    console.log(`   ${colors.yellow}fetch(getApiUrl(API_ENDPOINTS.PUBLISH_SIGNAL), { ... })${colors.reset}`);
    console.log('\n2. Restart your development server:');
    console.log(`   ${colors.yellow}npm run dev${colors.reset}`);
    console.log('\n3. Deploy to Vercel:');
    console.log(`   ${colors.yellow}git add .${colors.reset}`);
    console.log(`   ${colors.yellow}git commit -m "Fix API URLs"${colors.reset}`);
    console.log(`   ${colors.yellow}git push${colors.reset}`);
}

// Run the script
main().catch(error => {
    log.error(`Script failed: ${error.message}`);
    process.exit(1);
});