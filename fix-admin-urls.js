// fix-admin-urls.js
// Fix the malformed template literals in admin/index.js

const fs = require('fs').promises;
const path = require('path');

async function fixAdminUrls() {
    console.log('🔧 Fixing URL template literals in admin/index.js...\n');
    
    try {
        const adminPath = path.join('pages', 'admin', 'index.js');
        let content = await fs.readFile(adminPath, 'utf8');
        
        // Backup the file
        await fs.writeFile(adminPath + '.backup', content);
        console.log('✅ Created backup: pages/admin/index.js.backup');
        
        // Fix patterns where ${ is missing
        const fixes = [
            // Fix: config.API_URL}/endpoint` → ${config.API_URL}/endpoint`
            {
                pattern: /config\.API_URL\}([^`]+)`/g,
                replacement: '${config.API_URL}$1`'
            },
            // Fix fetch calls that might be missing the template literal syntax
            {
                pattern: /fetch\(`([^$])/g,
                replacement: 'fetch(`$${1}'
            },
            // Fix any URL that has /api but no proper template literal
            {
                pattern: /`([^$\{]*)(config\.API_URL)([^}])/g,
                replacement: '`${$2}$3'
            }
        ];
        
        let fixCount = 0;
        fixes.forEach(fix => {
            const matches = content.match(fix.pattern);
            if (matches) {
                console.log(`Found ${matches.length} instances of pattern: ${fix.pattern}`);
                content = content.replace(fix.pattern, fix.replacement);
                fixCount += matches.length;
            }
        });
        
        // Specific fixes for the problematic lines
        const specificFixes = [
            {
                old: 'config.API_URL}/api/test-notifications/test-email`',
                new: '${config.API_URL}/api/test-notifications/test-email`'
            },
            {
                old: 'config.API_URL}/trades`',
                new: '${config.API_URL}/trades`'
            },
            {
                old: 'config.API_URL}/signals/performance/today`',
                new: '${config.API_URL}/signals/performance/today`'
            },
            {
                old: 'config.API_URL}/admin/subscription-stats`',
                new: '${config.API_URL}/admin/subscription-stats`'
            },
            {
                old: 'config.API_URL}/admin/members`',
                new: '${config.API_URL}/admin/members`'
            },
            {
                old: 'config.API_URL}/signals/all`',
                new: '${config.API_URL}/signals/all`'
            },
            {
                old: 'config.API_URL}${endpoint}`',
                new: '${config.API_URL}${endpoint}`'
            },
            {
                old: 'config.API_URL}/admin/members/${userId}/activate`',
                new: '${config.API_URL}/admin/members/${userId}/activate`'
            },
            {
                old: 'config.API_URL}/trades/${tradeId}/close`',
                new: '${config.API_URL}/trades/${tradeId}/close`'
            }
        ];
        
        specificFixes.forEach(fix => {
            if (content.includes(fix.old)) {
                content = content.replace(new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.new);
                console.log(`Fixed: ${fix.old} → ${fix.new}`);
                fixCount++;
            }
        });
        
        if (fixCount > 0) {
            // Write the fixed content
            await fs.writeFile(adminPath, content);
            console.log(`\n✅ Fixed ${fixCount} URL issues in admin/index.js`);
            
            // Show a sample of the fixes
            console.log('\n📋 Sample of fixed fetch calls:');
            const fetchCalls = content.match(/fetch\(`\$\{config\.API_URL\}[^`]+`/g);
            if (fetchCalls) {
                fetchCalls.slice(0, 3).forEach(call => {
                    console.log(`  ✓ ${call.substring(0, 60)}...`);
                });
            }
        } else {
            console.log('\n✅ No URL issues found - file might already be fixed');
        }
        
        console.log('\n📝 Next steps:');
        console.log('1. Restart your dev server: npm run dev');
        console.log('2. Clear browser cache and refresh');
        console.log('3. Test the "Publish Signal" button');
        console.log('4. If it works, deploy to Vercel:');
        console.log('   git add pages/admin/index.js');
        console.log('   git commit -m "Fix template literal URLs in admin"');
        console.log('   git push');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Also create a verification function
async function verifyUrls() {
    console.log('\n🔍 Verifying all URLs are properly formatted...\n');
    
    try {
        const adminPath = path.join('pages', 'admin', 'index.js');
        const content = await fs.readFile(adminPath, 'utf8');
        
        // Find all fetch calls
        const fetchRegex = /fetch\(`[^`]+`/g;
        const fetchCalls = content.match(fetchRegex) || [];
        
        console.log(`Found ${fetchCalls.length} fetch calls:\n`);
        
        let issueCount = 0;
        fetchCalls.forEach((call, i) => {
            // Check if it has proper template literal syntax
            const hasProperTemplate = call.includes('${');
            const status = hasProperTemplate ? '✅' : '❌';
            
            if (!hasProperTemplate && call.includes('config.API_URL')) {
                console.log(`${status} ${i + 1}. ${call}`);
                issueCount++;
            }
        });
        
        if (issueCount === 0) {
            console.log('✅ All URLs are properly formatted!');
        } else {
            console.log(`\n❌ Found ${issueCount} URLs with issues`);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run both functions
async function main() {
    await fixAdminUrls();
    await verifyUrls();
}

main().catch(console.error);