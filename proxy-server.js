const PORT = process.env.PORT || 3000;
// Simple Node.js proxy server using only built-in modules
const http = require('http');
const https = require('https');
const urlModule = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = urlModule.parse(req.url, true);
    if (parsedUrl.pathname === '/proxy') {
        const targetUrl = parsedUrl.query.url;
        if (!targetUrl || !/^https?:\/\//.test(targetUrl)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid URL');
            return;
        }
        const client = targetUrl.startsWith('https') ? https : http;
        const proxyReq = client.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; HYP3RSP4C3-Proxy/1.0)'
            }
        }, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });
        proxyReq.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error fetching URL');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});