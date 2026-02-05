// Check what methods PDFParse instance has
const pdfParseModule = require('pdf-parse');
const PDFParse = pdfParseModule.PDFParse;

console.log('Module exports:', Object.keys(pdfParseModule));

const testBuffer = Buffer.from('test');
const parser = new PDFParse(testBuffer);
console.log('Parser instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));
console.log('Parser instance:', parser);

// Maybe it's used differently - let's try the old way
console.log('\nTrying different approaches:');

// Try if PDFParse can be called as function
try {
    const result = PDFParse(testBuffer);
    console.log('PDFParse(buffer) worked! Result type:', typeof result);
} catch (e) {
    console.log('PDFParse(buffer) failed:', e.message);
}

// Maybe there's a default export or parse function
if (pdfParseModule.default) {
    console.log('Has default export');
}

if (pdfParseModule.parse) {
    console.log('Has parse method');
}
