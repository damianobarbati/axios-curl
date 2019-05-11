import http from 'http';

http.createServer((request, response) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Max-Age': 3600,
    };

    if (request.method === 'OPTIONS') {
        response.writeHead(204, headers);
        response.end();
        return;
    }

    if (!['GET', 'POST'].includes(request.method)) {
        response.writeHead(405, headers);
        response.end(`${request.method} is not allowed for the request.`);
    }
    else {
        let body = '';
        request.on('data', chunk => body += chunk.toString());
        request.on('end', () => {
            const result = JSON.stringify({ method: request.method, headers: request.headers, body }, null, 4);
            console.log(result);
            response.writeHead(200, { ...headers, 'Content-Type': 'text/plain' });
            response.write(result);
            response.end();
        });
    }
}).listen(8080);