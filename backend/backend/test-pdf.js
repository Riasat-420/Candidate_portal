// Test if pdf-parse is working
const pdfParse = require('pdf-parse');

console.log('Type of pdfParse:', typeof pdfParse);
console.log('pdfParse keys:', Object.keys(pdfParse));
console.log('pdfParse.default?:', typeof pdfParse.default);
console.log('pdfParse itself:', pdfParse);
