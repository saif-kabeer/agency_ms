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

// POST route to create new clients
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

// GET route to fetch projects
app.get('/projects', (req, res) => {
    const sql = 'SELECT p.project_id, p.name, p.start_date, p.end_date, p.status, c.name as client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.client_id';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching projects:', err);
            res.status(500).send('Error retrieving projects');
        } else {
            res.json(result);
        }
    });
});

// Add POST route to create new projects
app.post('/projects', (req, res) => {
    const { client_id, name, start_date, end_date, status } = req.body;

    // Basic validation
    if (!name || !client_id) {
        return res.status(400).send('Project name and client ID are required.');
    }
    // Optional: Validate status enum if needed

    const sql = 'INSERT INTO projects (client_id, name, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)';
    // Ensure dates are null if not provided or empty
    const values = [
        client_id,
        name,
        start_date || null,
        end_date || null,
        status || 'Planned' // Default status if not provided
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding project:', err);
            // Check for foreign key constraint error
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).send('Invalid client_id provided.');
            }
            res.status(500).send('Error adding project');
        } else {
            res.status(201).json({ message: 'Project added successfully', projectId: result.insertId });
        }
    });
});

// Add GET route to fetch staff
app.get('/staff', (req, res) => {
    const sql = 'SELECT * FROM staff';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching staff:', err);
            res.status(500).send('Error retrieving staff');
        } else {
            res.json(result);
        }
    });
});

// Add POST route to create new staff
app.post('/staff', (req, res) => {
    const { name, email, role } = req.body;

    // Basic validation
    if (!name) {
        return res.status(400).send('Staff name is required.');
    }
    // Optional: Validate email format

    const sql = 'INSERT INTO staff (name, email, role) VALUES (?, ?, ?)';
    const values = [name, email || null, role || null];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding staff:', err);
             // Check for unique constraint error (email)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('Email already exists.');
            }
            res.status(500).send('Error adding staff');
        } else {
            res.status(201).json({ message: 'Staff added successfully', staffId: result.insertId });
        }
    });
});

// --- Resource Routes ---

// GET route to fetch all resources
app.get('/resources', (req, res) => {
    const sql = 'SELECT * FROM resources';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching resources:', err);
            res.status(500).send('Error retrieving resources');
        } else {
            res.json(result);
        }
    });
});

// POST route to create a new resource
app.post('/resources', (req, res) => {
    const { name, type, cost_per_unit } = req.body;

    if (!name || !type) {
        return res.status(400).send('Resource name and type are required.');
    }

    const sql = 'INSERT INTO resources (name, type, cost_per_unit) VALUES (?, ?, ?)';
    const values = [name, type, cost_per_unit || null]; // Handle optional cost

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding resource:', err);
            res.status(500).send('Error adding resource');
        } else {
            res.status(201).json({ message: 'Resource added successfully', resourceId: result.insertId });
        }
    });
});


// --- Invoice Routes ---

// GET route to fetch all invoices (joining with clients)
app.get('/invoices', (req, res) => {
    // Join with clients to get client name
    const sql = `
        SELECT i.invoice_id, i.issue_date, i.due_date, i.total_amount, i.status,
               c.name as client_name, c.client_id,
               p.name as project_name, p.project_id
        FROM invoices i
        JOIN clients c ON i.client_id = c.client_id
        LEFT JOIN projects p ON i.project_id = p.project_id
        ORDER BY i.issue_date DESC
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching invoices:', err);
            res.status(500).send('Error retrieving invoices');
        } else {
            res.json(result);
        }
    });
});

// POST route to create a new invoice
app.post('/invoices', (req, res) => {
    const { client_id, project_id, issue_date, due_date, total_amount, status } = req.body;

    if (!client_id || !issue_date || !due_date || total_amount === undefined || total_amount === null) {
        return res.status(400).send('Client, issue date, due date, and total amount are required.');
    }
    if (isNaN(parseFloat(total_amount)) || !isFinite(total_amount) || total_amount < 0) {
         return res.status(400).send('Invalid total amount.');
    }

    const sql = 'INSERT INTO invoices (client_id, project_id, issue_date, due_date, total_amount, status) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [
        client_id,
        project_id || null, // Project can be optional
        issue_date,
        due_date,
        total_amount,
        status || 'Draft' // Default status
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding invoice:', err);
             // Check for foreign key constraint error
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).send('Invalid client_id or project_id provided.');
            }
            res.status(500).send('Error adding invoice');
        } else {
            res.status(201).json({ message: 'Invoice added successfully', invoiceId: result.insertId });
        }
    });
});

// --- Payment Routes (Basic Placeholder - GET only for now) ---
// You would typically add POST for recording payments against invoices
app.get('/payments', (req, res) => {
    // Join with invoices and clients for context
    const sql = `
        SELECT pay.payment_id, pay.payment_date, pay.amount, pay.method,
               i.invoice_id, c.name as client_name
        FROM payments pay
        JOIN invoices i ON pay.invoice_id = i.invoice_id
        JOIN clients c ON i.client_id = c.client_id
        ORDER BY pay.payment_date DESC
    `;
     db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching payments:', err);
            res.status(500).send('Error retrieving payments');
        } else {
            res.json(result);
        }
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

