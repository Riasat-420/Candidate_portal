// Quick test of pdf-parse import
const pdfParseModule = require('pdf-parse');

console.log('pdf-parse module:', pdfParseModule);
console.log('PDFParse class:', pdfParseModule.PDFParse);
console.log('Type of PDFParse:', typeof pdfParseModule.PDFParse);
console.log('All exports:', Object.keys(pdfParseModule));
