// Test actual PDF parsing with the new API
const pdfParseModule = require('pdf-parse');
const PDFParse = pdfParseModule.PDFParse;
const fs = require('fs').promises;

async function test() {
    try {
        console.log('PDFParse class:', PDFParse);

        // Try to parse a simple test (empty buffer just to see the error)
        const testBuffer = Buffer.from('test');
        const parser = new PDFParse(testBuffer);
        console.log('Parser created:', parser);

        const result = await parser.render();
        console.log('Result:', result);
    } catch (error) {
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

test();
