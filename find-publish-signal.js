// find-publish-signal.js
// Find and display the signal publishing code

const fs = require('fs').promises;
const path = require('path');

async function findPublishSignalCode() {
    console.log('🔍 Looking for publishSignal function...\n');
    
    try {
        const adminPath = path.join('pages', 'admin', 'index.js');
        const content = await fs.readFile(adminPath, 'utf8');
        
        // Find the publishSignal function
        const functionRegex = /(?:const|function)\s+publishSignal[^{]*{[\s\S]*?^}/gm;
        const matches = content.match(functionRegex);
        
        if (matches) {
            console.log('Found publishSignal function:\n');
            console.log('```javascript');
            console.log(matches[0]);
            console.log('```\n');
        }
        
        // Also look for any fetch calls that might be going to getmoonshots
        const fetchRegex = /fetch\s*\([^)]+\)/g;
        const fetchMatches = content.match(fetchRegex);
        
        if (fetchMatches) {
            console.log('All fetch calls in admin/index.js:\n');
            fetchMatches.forEach((match, i) => {
                if (match.includes('signal') || match.includes('publish')) {
                    console.log(`${i + 1}. ${match}`);
                }
            });
        }
        
        // Look for the actual button click handler
        console.log('\n🔍 Looking for button onClick handler...\n');
        const buttonRegex = /onClick\s*=\s*{[^}]+publishSignal[^}]+}/g;
        const buttonMatches = content.match(buttonRegex);
        
        if (buttonMatches) {
            console.log('Found button handler:');
            buttonMatches.forEach(match => console.log(match));
        }
        
        // Check if there's any hardcoded URL
        if (content.includes('getmoonshots.com')) {
            console.log('\n⚠️  WARNING: Found "getmoonshots.com" in the file!');
            
            // Find the lines
            const lines = content.split('\n');
            lines.forEach((line, i) => {
                if (line.includes('getmoonshots.com')) {
                    console.log(`Line ${i + 1}: ${line.trim()}`);
                }
            });
        }
        
    } catch (error) {
        console.error('Error reading admin/index.js:', error.message);
    }
}

// Also check for any API configuration
async function checkAPIConfiguration() {
    console.log('\n🔍 Checking how config is imported...\n');
    
    try {
        const adminPath = path.join('pages', 'admin', 'index.js');
        const content = await fs.readFile(adminPath, 'utf8');
        
        // Find import statements
        const importRegex = /import.*config.*from.*/g;
        const imports = content.match(importRegex);
        
        if (imports) {
            console.log('Config imports:');
            imports.forEach(imp => console.log(imp));
        }
        
        // Check how config.API_URL is used
        const configUsageRegex = /config\.API_URL[^,\s)]*/g;
        const usage = content.match(configUsageRegex);
        
        if (usage) {
            console.log('\nconfig.API_URL usage:');
            usage.forEach(use => console.log(use));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    await findPublishSignalCode();
    await checkAPIConfiguration();
    
    console.log('\n💡 If the code looks correct but still goes to getmoonshots.com,');
    console.log('   it might be cached. Try:');
    console.log('   1. Clear browser cache');
    console.log('   2. Hard refresh (Ctrl+Shift+R)');
    console.log('   3. Open in incognito/private window');
}

main().catch(console.error);