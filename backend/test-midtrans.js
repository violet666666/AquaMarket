// Test Midtrans create-transaction endpoint
const http = require('http');

const data = JSON.stringify({
  order_id: 'test-order-001',
  gross_amount: 1500000,
  customer_email: 'test@aquamarket.id',
  customer_name: 'Test User',
  items: [{ id: 'koi-001', name: 'Kohaku Premium 25cm', price: 1500000, quantity: 1 }]
});

const options = {
  hostname: 'localhost',
  port: 9000,
  path: '/store/custom/midtrans/create-transaction',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'x-publishable-api-key': 'pk_3f60f6b7a50e27f18f01b1c38983c6ddc7be2ffcd68a5310274293f99500c938'
  }
};

console.log('Testing Midtrans create-transaction...');
console.log('Request:', JSON.parse(data));
console.log('');

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(body);
      console.log('Response:', JSON.stringify(parsed, null, 2));
      if (parsed.token) {
        console.log('');
        console.log('='.repeat(50));
        console.log('SUCCESS! Snap token received!');
        console.log('Token:', parsed.token.substring(0, 30) + '...');
        console.log('Redirect:', parsed.redirect_url);
        console.log('Order ID:', parsed.order_id);
        console.log('='.repeat(50));
      } else if (parsed.error) {
        console.log('');
        console.log('ERROR:', parsed.error);
        if (parsed.details) console.log('Details:', JSON.stringify(parsed.details, null, 2));
      }
    } catch (e) {
      console.log('Raw response:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
