// debug-iis-config.js
// Place this in C:\inetpub\wwwroot\moonshot-frontend\moonshot-frontend\

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== MoonShot IIS Debug Script ===\n');

// 1. Check current directory and environment
console.log('1. ENVIRONMENT CHECK:');
console.log('   Current Directory:', process.cwd());
console.log('   Node Version:', process.version);
console.log('   Environment:', process.env.NODE_ENV || 'development');
console.log('   Port:', process.env.PORT || '3000');
console.log('');

// 2. Check if Next.js build exists
console.log('2. NEXT.JS BUILD CHECK:');
const buildPath = path.join(__dirname, '.next');
if (fs.existsSync(buildPath)) {
    console.log('   ✓ .next folder exists');
    const standaloneExists = fs.existsSync(path.join(buildPath, 'standalone'));
    console.log(`   ${standaloneExists ? '✓' : '✗'} .next/standalone exists`);
} else {
    console.log('   ✗ .next folder missing - run "npm run build"');
}
console.log('');

// 3. Check server.js configuration
console.log('3. SERVER.JS CHECK:');
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
    console.log('   ✓ server.js exists');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    if (serverContent.includes('createServer')) {
        console.log('   ✓ Server creation found');
    }
    // Check for common issues
    if (!serverContent.includes('process.env.PORT')) {
        console.log('   ⚠ Warning: server.js might not be using process.env.PORT');
    }
} else {
    console.log('   ✗ server.js missing');
}
console.log('');

// 4. Check IIS web.config
console.log('4. WEB.CONFIG CHECK:');
const webConfigPaths = [
    path.join(__dirname, 'web.config'),
    path.join(__dirname, 'public', 'web.config'),
    path.join(__dirname, '..', 'web.config')
];

let webConfigFound = false;
webConfigPaths.forEach(configPath => {
    if (fs.existsSync(configPath)) {
        console.log(`   ✓ Found web.config at: ${configPath}`);
        webConfigFound = true;
        
        const content = fs.readFileSync(configPath, 'utf8');
        
        // Check for URL Rewrite rules
        if (content.includes('<rewrite>')) {
            console.log('   ✓ URL Rewrite rules found');
        } else {
            console.log('   ✗ No URL Rewrite rules found');
        }
        
        // Check for iisnode
        if (content.includes('iisnode')) {
            console.log('   ✓ iisnode handler found');
        } else {
            console.log('   ✗ iisnode handler missing');
        }
        
        // Check for proxy rules
        if (content.includes('localhost:3000') || content.includes('127.0.0.1:3000')) {
            console.log('   ✓ Proxy to port 3000 found');
        }
    }
});

if (!webConfigFound) {
    console.log('   ✗ No web.config found!');
}
console.log('');

// 5. Test local server
console.log('5. LOCAL SERVER TEST:');
const testLocalServer = (callback) => {
    http.get('http://127.0.0.1:3000', (res) => {
        console.log(`   ✓ Local server responding on port 3000 (Status: ${res.statusCode})`);
        callback(true);
    }).on('error', (err) => {
        console.log(`   ✗ Local server not responding on port 3000: ${err.message}`);
        callback(false);
    });
};

// 6. Check IIS configuration
console.log('\n6. IIS CONFIGURATION:');
try {
    // Check if IIS is installed
    execSync('iisreset /status', { stdio: 'ignore' });
    console.log('   ✓ IIS is installed');
    
    // Check URL Rewrite module
    try {
        const urlRewriteCheck = execSync('reg query "HKLM\\SOFTWARE\\Microsoft\\IIS Extensions\\URL Rewrite" /v Version 2>nul', { encoding: 'utf8' });
        if (urlRewriteCheck) {
            console.log('   ✓ URL Rewrite module is installed');
        }
    } catch (e) {
        console.log('   ⚠ URL Rewrite module might not be installed');
    }
    
    // Check Application Request Routing
    try {
        execSync('netsh http show proxy', { stdio: 'ignore' });
        console.log('   ✓ ARR (Application Request Routing) appears to be configured');
    } catch (e) {
        console.log('   ⚠ ARR might not be configured properly');
    }
    
} catch (error) {
    console.log('   ✗ Could not check IIS status');
}
console.log('');

// 7. Test the actual domain (if provided)
console.log('7. DOMAIN TEST:');
const domain = process.argv[2]; // Pass domain as argument: node debug-iis-config.js yourdomain.com
if (domain) {
    https.get(`https://${domain}`, (res) => {
        console.log(`   ✓ HTTPS connection successful (Status: ${res.statusCode})`);
        
        // Check headers
        console.log('   Response Headers:');
        Object.entries(res.headers).forEach(([key, value]) => {
            if (key.toLowerCase().includes('server') || key.toLowerCase().includes('x-')) {
                console.log(`     ${key}: ${value}`);
            }
        });
    }).on('error', (err) => {
        console.log(`   ✗ HTTPS connection failed: ${err.message}`);
    });
} else {
    console.log('   ℹ No domain provided. Run with: node debug-iis-config.js yourdomain.com');
}
console.log('');

// 8. Generate recommended web.config
console.log('8. RECOMMENDED WEB.CONFIG:');
console.log('   Creating recommended web.config...');

const recommendedWebConfig = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <!-- URL Rewrite rules to proxy requests to Next.js -->
    <rewrite>
      <rules>
        <!-- Proxy all requests to Next.js server -->
        <rule name="ReverseProxyInboundRule" stopProcessing="true">
          <match url="(.*)" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="http://127.0.0.1:3000/{R:1}" />
        </rule>
      </rules>
      <outboundRules>
        <!-- Rewrite location headers -->
        <rule name="ReverseProxyOutboundRule">
          <match serverVariable="RESPONSE_Location" pattern="^http://127\\.0\\.0\\.1:3000/(.*)" />
          <action type="Rewrite" value="https://{HTTP_HOST}/{R:1}" />
        </rule>
      </outboundRules>
    </rewrite>
    
    <!-- Security headers -->
    <httpProtocol>
      <customHeaders>
        <remove name="X-Powered-By" />
        <add name="X-Frame-Options" value="SAMEORIGIN" />
        <add name="X-Content-Type-Options" value="nosniff" />
      </customHeaders>
    </httpProtocol>
    
    <!-- Enable proxy -->
    <proxy enabled="true" preserveHostHeader="true" />
    
    <!-- WebSocket support -->
    <webSocket enabled="true" />
  </system.webServer>
</configuration>`;

fs.writeFileSync('recommended-web.config', recommendedWebConfig);
console.log('   ✓ Created recommended-web.config');
console.log('');

// 9. Check common issues
console.log('9. COMMON ISSUES CHECK:');
testLocalServer((isRunning) => {
    if (!isRunning) {
        console.log('   ⚠ Next.js server is not running on port 3000');
        console.log('   → Solution: Start the server with "npm run start" or "node server.js"');
    }
    
    // Check package.json scripts
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log('\n   Package.json scripts:');
        if (packageJson.scripts) {
            Object.entries(packageJson.scripts).forEach(([key, value]) => {
                if (key.includes('start') || key.includes('build')) {
                    console.log(`     ${key}: ${value}`);
                }
            });
        }
    }
    
    console.log('\n10. NEXT STEPS:');
    console.log('   1. Ensure Next.js is built: npm run build');
    console.log('   2. Start the Next.js server: npm run start (or use PM2)');
    console.log('   3. Check IIS Application Pool is running');
    console.log('   4. Verify URL Rewrite module is installed');
    console.log('   5. Check Windows Firewall for port 3000');
    console.log('   6. Review IIS logs at: C:\\inetpub\\logs\\LogFiles');
    console.log('   7. Check Event Viewer for IIS errors');
    
    console.log('\n11. TEST COMMANDS:');
    console.log('   Test local: curl http://127.0.0.1:3000');
    console.log('   Test IIS: curl http://localhost');
    console.log('   Test HTTPS: curl https://getmoonshots.com');
});

// Create a simple test endpoint
console.log('\n12. CREATING TEST ENDPOINT:');
const testServerPath = 'test-iis-endpoint.js';
const testServerCode = `
const http = require('http');
const server = http.createServer((req, res) => {
    console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url} - Headers: \${JSON.stringify(req.headers)}\`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('IIS Proxy Test Successful\\n');
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(\`Test server running on port \${port}\`);
});
`;

fs.writeFileSync(testServerPath, testServerCode);
console.log(`   ✓ Created ${testServerPath} - Run this to test IIS proxy`);

// PM2 configuration check
console.log('\n13. PM2 CONFIGURATION:');
const ecosystemPath = path.join(__dirname, 'ecosystem.config.js');
if (fs.existsSync(ecosystemPath)) {
    console.log('   ✓ ecosystem.config.js exists');
    const ecosystemContent = fs.readFileSync(ecosystemPath, 'utf8');
    console.log('   Content preview:', ecosystemContent.substring(0, 200) + '...');
} else {
    console.log('   ✗ ecosystem.config.js missing');
}

console.log('\n=== Debug Complete ===');