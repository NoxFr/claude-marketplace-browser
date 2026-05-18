'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');

const HTMX_URL = 'https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js';
const destDir = path.join(__dirname, '..', 'vendor');
const destFile = path.join(destDir, 'htmx.min.js');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log(`Downloading htmx.min.js from ${HTMX_URL}...`);
https.get(HTMX_URL, (res) => {
  if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location, handleResponse).on('error', onError);
    return;
  }
  handleResponse(res);
}).on('error', onError);

function handleResponse(res) {
  if (res.statusCode !== 200) {
    console.error(`Failed: HTTP ${res.statusCode}`);
    process.exit(1);
  }
  const file = fs.createWriteStream(destFile);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`Saved to ${destFile}`);
  });
}

function onError(err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
