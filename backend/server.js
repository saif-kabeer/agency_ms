const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agency_ms'
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/clients', (req, res) => {
    const sql = 'SELECT * FROM clients';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching clients:', err);
            res.status(500).send('Error retrieving clients');
        } else {
            res.json(result);
        }
    });
});

// Add this POST route to handle creating new clients
app.post('/clients', (req, res) => {
    const { name, contact_info, contract_details } = req.body;

    // Basic validation
    if (!name) {
        return res.status(400).send('Client name is required.');
    }

    const sql = 'INSERT INTO clients (name, contact_info, contract_details) VALUES (?, ?, ?)';
    const values = [name, contact_info || null, contract_details || null]; // Use null for optional fields if empty

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding client:', err);
            res.status(500).send('Error adding client');
        } else {
            // Send back the newly created client ID
            res.status(201).json({ message: 'Client added successfully', clientId: result.insertId });
        }
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

