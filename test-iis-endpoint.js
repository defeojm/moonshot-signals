
const http = require('http');
const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Headers: ${JSON.stringify(req.headers)}`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('IIS Proxy Test Successful\n');
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Test server running on port ${port}`);
});
