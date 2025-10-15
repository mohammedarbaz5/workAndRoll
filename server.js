// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and serve static files from the 'public' directory
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint: GET /api/menu
// Reads and returns the menu data from menu.json
app.get('/api/menu', (req, res) => {
    fs.readFile(path.join(__dirname, 'menu.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading menu.json:', err);
            return res.status(500).json({ error: 'Failed to read menu data.' });
        }
        try {
            const menuData = JSON.parse(data);
            res.json(menuData);
        } catch (parseErr) {
            console.error('Error parsing menu.json:', parseErr);
            return res.status(500).json({ error: 'Failed to parse menu data.' });
        }
    });
});

// API Endpoint: POST /api/order
// Receives order data, logs it, and returns a success response
app.post('/api/order', (req, res) => {
    const order = req.body;
    
    // Simple validation
    if (!order || !order.items || !order.customer) {
        return res.status(400).json({ success: false, message: 'Invalid order data.' });
    }

    const timestamp = new Date().toISOString();
    const orderId = Date.now(); // Simple unique ID for this example
    
    console.log('--- New Order Received ---');
    console.log(`Order ID: ${orderId}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log('Customer Details:', order.customer);
    console.log('Order Items:');
    order.items.forEach(item => {
        console.log(`- ${item.name} (x${item.quantity})`);
    });
    console.log(`Total: ₹${order.total.toFixed(2)}`);
    console.log('--------------------------\n');

    // Respond to the client
    res.json({ 
        success: true, 
        message: 'Order placed successfully!', 
        orderId: orderId 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🥡 Wok & Roll server is running on http://localhost:${PORT}`);
});

