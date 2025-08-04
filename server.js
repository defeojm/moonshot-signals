// Use development mode to bypass build issues
// process.env.NODE_ENV = 'development';
// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Set to production for live site
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Custom security headers middleware
const addSecurityHeaders = (req, res) => {
  // These headers supplement what's in web.config
  res.setHeader('X-DNS-Prefetch-Control', 'on');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Only add HSTS if you have SSL configured
  if (!dev && req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
};

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Add security headers to all responses
      addSecurityHeaders(req, res);
      
      const parsedUrl = parse(req.url, true);
      
      // Block access to sensitive files (backup for IIS rules)
      const blockedPaths = ['/api/config', '/.env', '/.git', '/node_modules'];
      if (blockedPaths.some(path => parsedUrl.pathname.startsWith(path))) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      
      // Don't expose error details in production
      if (dev) {
        res.statusCode = 500;
        res.end(`Internal server error: ${err.message}`);
      } else {
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server running on http://${hostname}:${port} [${dev ? 'development' : 'production'} mode]`);
  });
}).catch((err) => {
  console.error('Error during Next.js initialization:', err);
  process.exit(1);
});