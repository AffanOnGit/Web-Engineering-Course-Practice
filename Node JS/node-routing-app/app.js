// app.js
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// Define content types for different file extensions
const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

// Helper function to serve static files
async function serveStaticFile(filePath, contentType, res) {
    try {
        const data = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

// Create the server
const server = http.createServer(async (req, res) => {
    const { url, method } = req;
    
    // Log each request
    console.log(`${method} ${url}`);

    // Handle different routes
    switch(true) {
        // Home page route
        case url === '/' && method === 'GET':
            await serveStaticFile(path.join(__dirname, 'public', 'index.html'), 'text/html', res);
            break;

        // About page route    
        case url === '/about' && method === 'GET':
            await serveStaticFile(path.join(__dirname, 'public', 'about.html'), 'text/html', res);
            break;

        // Contact page route    
        case url === '/contact' && method === 'GET':
            await serveStaticFile(path.join(__dirname, 'public', 'contact.html'), 'text/html', res);
            break;

        // API route for users
        case url === '/api/users' && method === 'GET':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' }
            ]));
            break;

        // Handle form submission
        case url === '/submit-form' && method === 'POST':
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                console.log('Form data received:', JSON.parse(body));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Form submitted successfully!' }));
            });
            break;

        // Serve static files (CSS, JS)
        case url.match(/\.(css|js)$/):
            const ext = path.extname(url);
            await serveStaticFile(path.join(__dirname, 'public', url), contentTypes[ext], res);
            break;

        // 404 route for unmatched routes
        default:
            await serveStaticFile(path.join(__dirname, 'public', '404.html'), 'text/html', res);
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});