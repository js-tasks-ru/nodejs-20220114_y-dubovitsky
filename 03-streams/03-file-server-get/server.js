const http = require('http');
const path = require('path');
const fs = require('fs');
const PATH_SEPARATOR = '/';

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  
  switch (req.method) {
    case 'GET':
      if (isInternalPath(pathname, PATH_SEPARATOR)) {
        res.writeHead(400, {'Content-Type': 'text/plain', 'Charset': 'utf-8'});
        res.write('Никаких вложенных путей: /dir1/dir2/filename');
        res.end();
        return;
      }
      const readStream = fs.createReadStream(filepath);
      readStream.setEncoding('UTF8');
      readStream.on('data', (chunk) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(chunk);
        res.end();
      });
      readStream.on('error', (error) => {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        console.log(error);
        res.write(`error: ${error}`);
        res.end();
      });
      readStream.on('close', () => {
        readStream.destroy();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

const isInternalPath = (str, symb) => {
  for (var count = -1, index = 0; index != -1; count++, index = str.indexOf(symb, index + 1));
  return count > 0;
};

module.exports = server;
