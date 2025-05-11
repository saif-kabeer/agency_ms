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
    // SQL: SELECT * FROM clients;
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

    // SQL: INSERT INTO clients (name, contact_info, contract_details) VALUES (?, ?, ?);
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
    // SQL: SELECT p.project_id, p.name, p.start_date, p.end_date, p.status, c.name as client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.client_id;
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

    // SQL: INSERT INTO projects (client_id, name, start_date, end_date, status) VALUES (?, ?, ?, ?, ?);
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
    // SQL: SELECT * FROM staff;
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

    // SQL: INSERT INTO staff (name, email, role) VALUES (?, ?, ?);
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
    // SQL: SELECT r.resource_id, r.type, r.amount, r.project_id, p.name as project_name FROM resources r LEFT JOIN projects p ON r.project_id = p.project_id ORDER BY r.resource_id DESC;
    const sql = `
        SELECT r.resource_id, r.type, r.amount, r.project_id,
               p.name as project_name
        FROM resources r
        LEFT JOIN projects p ON r.project_id = p.project_id
        ORDER BY r.resource_id DESC
    `;
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
    const { type, project_id, amount } = req.body;

    if (!type || amount === undefined || amount === null) {
        return res.status(400).send('Resource type and amount are required.');
    }
    if (isNaN(parseFloat(amount)) || !isFinite(amount) || amount < 0) {
        return res.status(400).send('Invalid amount.');
    }


    // SQL: INSERT INTO resources (type, project_id, amount) VALUES (?, ?, ?);
    const sql = 'INSERT INTO resources (type, project_id, amount) VALUES (?, ?, ?)';
    const values = [type, project_id || null, amount]; // Handle optional project_id

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding resource:', err);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).send('Invalid project_id provided.');
            }
            res.status(500).send('Error adding resource');
        } else {
            res.status(201).json({ message: 'Resource added successfully', resourceId: result.insertId });
        }
    });
});


// --- Payment Routes ---
app.get('/payments', (req, res) => {
    // SQL: SELECT pay.payment_id, pay.payment_date, pay.amount_paid, pay.details, p.name as project_name, p.project_id FROM payments pay JOIN projects p ON pay.project_id = p.project_id ORDER BY pay.payment_date DESC;
    const sql = `
        SELECT pay.payment_id, pay.payment_date, pay.amount_paid, pay.details,
               p.name as project_name, p.project_id
        FROM payments pay
        JOIN projects p ON pay.project_id = p.project_id
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

// POST route to create a new payment
app.post('/payments', (req, res) => {
    const { project_id, payment_date, amount_paid, details } = req.body;

    if (!project_id || !payment_date || amount_paid === undefined || amount_paid === null) {
        return res.status(400).send('Project, payment date, and amount paid are required.');
    }
    if (isNaN(parseFloat(amount_paid)) || !isFinite(amount_paid) || parseFloat(amount_paid) <= 0) {
        return res.status(400).send('Invalid amount paid. Must be a positive number.');
    }

    // SQL: INSERT INTO payments (project_id, payment_date, amount_paid, details) VALUES (?, ?, ?, ?);
    const sql = 'INSERT INTO payments (project_id, payment_date, amount_paid, details) VALUES (?, ?, ?, ?)';
    const values = [
        project_id,
        payment_date,
        parseFloat(amount_paid),
        details || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding payment:', err);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).send('Invalid project_id provided.');
            }
            res.status(500).send('Error adding payment');
        } else {
            res.status(201).json({ message: 'Payment recorded successfully', paymentId: result.insertId });
        }
    });
});

// --- Task Routes ---

// GET route to fetch all tasks
app.get('/tasks', (req, res) => {
    // SQL: SELECT t.task_id, t.title, t.deadline, t.priority, t.status, t.project_id, p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.project_id ORDER BY t.priority ASC, t.deadline ASC, t.task_id DESC;
    const sql = `
        SELECT t.task_id, t.title, t.deadline, t.priority, t.status,
               t.project_id, p.name as project_name
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.project_id
        ORDER BY t.priority ASC, t.deadline ASC, t.task_id DESC
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            res.status(500).send('Error retrieving tasks');
        } else {
            res.json(result);
        }
    });
});

// POST route to create a new task
app.post('/tasks', (req, res) => {
    const { project_id, title, deadline, priority, status } = req.body;

    if (!title || !project_id) {
        return res.status(400).send('Task title and project ID are required.');
    }
    if (priority && (isNaN(parseInt(priority)) || parseInt(priority) < 0)) {
        return res.status(400).send('Priority must be a non-negative integer.');
    }
    // Optional: Validate status enum if needed

    // SQL: INSERT INTO tasks (project_id, title, deadline, priority, status) VALUES (?, ?, ?, ?, ?);
    const sql = 'INSERT INTO tasks (project_id, title, deadline, priority, status) VALUES (?, ?, ?, ?, ?)';
    const values = [
        project_id,
        title,
        deadline || null,
        priority || null,
        status || 'Not Started'
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding task:', err);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).send('Invalid project_id provided.');
            }
            res.status(500).send('Error adding task');
        } else {
            res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
        }
    });
});

// --- Task Assignment Routes ---

app.get('/task_assignments', (req, res) => {
    // SQL: SELECT ta.task_id, ta.staff_id, ta.approved, t.title as task_title, s.name as staff_name FROM task_assignments ta JOIN tasks t ON ta.task_id = t.task_id JOIN staff s ON ta.staff_id = s.staff_id ORDER BY t.title ASC, s.name ASC;
    const sql = `
        SELECT ta.task_id, ta.staff_id, ta.approved,
               t.title as task_title,
               s.name as staff_name
        FROM task_assignments ta
        JOIN tasks t ON ta.task_id = t.task_id
        JOIN staff s ON ta.staff_id = s.staff_id
        ORDER BY t.title ASC, s.name ASC
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching task assignments:', err);
            res.status(500).send('Error retrieving task assignments');
        } else {
            res.json(result);
        }
    });
});

// POST route to create a new task assignment
app.post('/task_assignments', (req, res) => {
    const { task_id, staff_id } = req.body;

    if (!task_id || !staff_id) {
        return res.status(400).send('Task ID and Staff ID are required for assignment.');
    }

    // 'approved' field is part of the table, default to 0 (false) or 1 (true) based on your logic.
    // Since you mentioned manual approval, this might be set to 0 initially,
    // or 1 if assignment implies a level of approval.
    // For consistency with previous 'approval' logic where it was set to 1:
    const approved = 1; // Or 0 if assignment doesn't mean approved yet.
    // SQL: INSERT INTO task_assignments (task_id, staff_id, approved) VALUES (?, ?, ?);
    const sql = 'INSERT INTO task_assignments (task_id, staff_id, approved) VALUES (?, ?, ?)';
    const values = [task_id, staff_id, approved];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding task assignment:', err);
            // Check for foreign key constraint error
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).send('Invalid task_id or staff_id provided.');
            }
            // Check for duplicate entry if a unique constraint is set on (task_id, staff_id)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send('This task has already been assigned to this staff member.');
            }
            res.status(500).send('Error adding task assignment');
        } else {
            res.status(201).json({ message: 'Task assignment recorded successfully', assignmentId: result.insertId });
        }
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

