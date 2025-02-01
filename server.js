const http = require('http');
const url = require('url');
const utils = require('./modules/utils');
const MESSAGES = require('./lang/en/en.js');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/getDate/') {
    const name = parsedUrl.query.name || 'Guest';
    const date = utils.getDate();
    const message = `<span style="color: blue;">${MESSAGES.greeting.replace('%1', name)} ${date}</span>`;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(message);
  } else if (parsedUrl.pathname === '/writeFile/') {
    const text = parsedUrl.query.text;
      if (text) {
        fs.appendFile('file.txt', text + '\n', (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Text appended to file');
          }
        });
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: No text provided');
      }
  } else if (parsedUrl.pathname === '/readFile/') {
    fs.readFile('file.txt', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: File does not exist');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      }
  });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});