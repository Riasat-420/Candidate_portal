const jwt = require('jsonwebtoken');
const http = require('http');
require('dotenv').config();

// Generate admin token
const token = jwt.sign(
    {
        id: 'a71b167a-7584-4a6f-809a-6b3bbb5dd6dc',
        email: 'admin@test.com',
        role: 'admin'
    },
    process.env.JWT_SECRET || 'candidates3pgsecure202505',
    { expiresIn: '1h' }
);

console.log('Testing /api/admin/audio endpoint...');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/audio',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log('Response:', JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
