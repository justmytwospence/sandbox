// scripts/generate-file-list.js
const fs = require('fs');
const path = require('path');

const publicFolder = path.join(__dirname, '../public/data/gpx');
const outputFilePath = path.join(__dirname, '../src/data/gpxManifest.json');

const getFiles = (dir) => {
  return fs.readdirSync(dir).map(file => `${file}`);
};

const fileList = getFiles(publicFolder);
fs.writeFileSync(outputFilePath, JSON.stringify(fileList, null, 2));

console.log('File list generated:', fileList);
