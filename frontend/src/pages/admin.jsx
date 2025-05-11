import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';

function AdminDashboard() {
    // Existing State
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState({ name: '', contact_info: '', contract_details: '' });
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ client_id: '', name: '', start_date: '', end_date: '', status: 'Planned' });
    const [staff, setStaff] = useState([]);
    const [newStaff, setNewStaff] = useState({ name: '', email: '', role: '' });
    const [isLoading, setIsLoading] = useState(false); // Shared loading for clients for now
    const [error, setError] = useState(null); // Shared error for clients for now
    const [isProjectsLoading, setIsProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState(null);
    const [isStaffLoading, setIsStaffLoading] = useState(false);
    const [staffError, setStaffError] = useState(null);

    // New State for Resources
    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState({ type: '', project_id: '', amount: '' }); // Updated state
    const [isResourcesLoading, setIsResourcesLoading] = useState(false);
    const [resourcesError, setResourcesError] = useState(null);

    // State for Payments (formerly Invoices & Payments)
    const [payments, setPayments] = useState([]);
    const [newPayment, setNewPayment] = useState({ project_id: '', payment_date: '', amount_paid: '', details: '' });
    const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState(null);

    // New State for Tasks
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ project_id: '', title: '', deadline: '', priority: '', status: 'Not Started' });
    const [isTasksLoading, setIsTasksLoading] = useState(false);
    const [tasksError, setTasksError] = useState(null);

    // Renamed State for Task Assignments
    const [taskAssignments, setTaskAssignments] = useState([]);
    const [newTaskAssignment, setNewTaskAssignment] = useState({ task_id: '', staff_id: '' });
    const [isTaskAssignmentsLoading, setIsTaskAssignmentsLoading] = useState(false);
    const [taskAssignmentsError, setTaskAssignmentsError] = useState(null);

    // State for Financial Overview
    const [selectedFinancialStatus, setSelectedFinancialStatus] = useState('Ongoing'); // Options: 'Ongoing', 'Completed', 'Not Started'
    const [financialSummary, setFinancialSummary] = useState({
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        projectsBreakdown: [],
    });


    // --- Fetching Functions ---
    // SQL: SELECT client_id, name, contact_info, contract_details FROM clients;
    const fetchClients = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/clients');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setClients(data);
        } catch (e) {
            console.error("Failed to fetch clients:", e);
            setError('Failed to load clients.');
        } finally {
            setIsLoading(false);
        }
    };

    // SQL: SELECT p.project_id, p.client_id, p.name, p.start_date, p.end_date, p.status, c.name AS client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.client_id;
    const fetchProjects = async () => {
        setIsProjectsLoading(true);
        setProjectsError(null);
        try {
            const response = await fetch('http://localhost:3000/projects');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProjects(data);
        } catch (e) {
            console.error("Failed to fetch projects:", e);
            setProjectsError('Failed to load projects.');
        } finally {
            setIsProjectsLoading(false);
        }
    };

    // New function to fetch staff
    // SQL: SELECT staff_id, name, email, role FROM staff;
    const fetchStaff = async () => {
        setIsStaffLoading(true);
        setStaffError(null);
        try {
            const response = await fetch('http://localhost:3000/staff');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setStaff(data);
        } catch (e) {
            console.error("Failed to fetch staff:", e);
            setStaffError('Failed to load staff.');
        } finally {
            setIsStaffLoading(false);
        }
    };

    // SQL: SELECT r.resource_id, r.type, r.project_id, r.amount, p.name AS project_name FROM resources r LEFT JOIN projects p ON r.project_id = p.project_id;
    const fetchResources = async () => {
        setIsResourcesLoading(true);
        setResourcesError(null);
        try {
            const response = await fetch('http://localhost:3000/resources');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setResources(data);
        } catch (e) {
            console.error("Failed to fetch resources:", e);
            setResourcesError('Failed to load resources.');
        } finally {
            setIsResourcesLoading(false);
        }
    };

    // Removed fetchInvoices

    // SQL: SELECT py.payment_id, py.project_id, py.payment_date, py.amount_paid, py.details, p.name AS project_name FROM payments py LEFT JOIN projects p ON py.project_id = p.project_id;
     const fetchPayments = async () => {
        setIsPaymentsLoading(true);
        setPaymentsError(null);
        try {
            const response = await fetch('http://localhost:3000/payments');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setPayments(data);
        } catch (e) {
            console.error("Failed to fetch payments:", e);
            setPaymentsError('Failed to load payments.');
        } finally {
            setIsPaymentsLoading(false);
        }
    };

    // SQL: SELECT t.task_id, t.project_id, t.title, t.deadline, t.priority, t.status, p.name AS project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.project_id;
    const fetchTasks = async () => {
        setIsTasksLoading(true);
        setTasksError(null);
        try {
            const response = await fetch('http://localhost:3000/tasks');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setTasks(data);
        } catch (e) {
            console.error("Failed to fetch tasks:", e);
            setTasksError('Failed to load tasks.');
        } finally {
            setIsTasksLoading(false);
        }
    };

    // SQL: SELECT ta.assignment_id, ta.task_id, ta.staff_id, t.title AS task_title, s.name AS staff_name FROM task_assignments ta JOIN tasks t ON ta.task_id = t.task_id JOIN staff s ON ta.staff_id = s.staff_id;
    const fetchTaskAssignments = async () => {
        setIsTaskAssignmentsLoading(true);
        setTaskAssignmentsError(null);
        try {
            const response = await fetch('http://localhost:3000/task_assignments');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setTaskAssignments(data);
        } catch (e) {
            console.error("Failed to fetch task assignments:", e);
            setTaskAssignmentsError('Failed to load task assignments.');
        } finally {
            setIsTaskAssignmentsLoading(false);
        }
    };

    // Fetch all data on component mount
    useEffect(() => {
        fetchClients();
        fetchProjects();
        fetchStaff();
        fetchResources();
        // fetchInvoices(); // Removed
        fetchPayments();
        fetchTasks();
        fetchTaskAssignments();
    }, []);

    // --- Input Handlers ---
    const handleClientInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient((prev) => ({ ...prev, [name]: value }));
    };

    const handleProjectInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };

    const handleStaffInputChange = (e) => {
        const { name, value } = e.target;
        setNewStaff((prev) => ({ ...prev, [name]: value }));
    };

    const handleResourceInputChange = (e) => {
        const { name, value } = e.target;
        setNewResource((prev) => ({ ...prev, [name]: value }));
    };

    // Removed handleInvoiceInputChange

    const handlePaymentInputChange = (e) => {
        const { name, value } = e.target;
        setNewPayment((prev) => ({ ...prev, [name]: value }));
    };

    const handleTaskInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleTaskAssignmentInputChange = (e) => {
        const { name, value } = e.target;
        setNewTaskAssignment((prev) => ({ ...prev, [name]: value }));
    };


    // --- Add Handlers ---
    // SQL: INSERT INTO clients (name, contact_info, contract_details) VALUES ($1, $2, $3) RETURNING client_id;
    const handleAddClient = async (e) => {
        e.preventDefault();
        // Basic validation: ensure name is not empty
        if (!newClient.name.trim()) {
                alert('Client Name is required.');
                return;
        }

        setIsLoading(true); // Optional: indicate loading
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClient), // Send new client data
            });

            if (!response.ok) {
                 const errorData = await response.text(); // Or response.json() if backend sends JSON error
                 throw new Error(`Failed to add client: ${errorData}`);
            }

            // const result = await response.json(); // Contains { message: '...', clientId: ... }
            // console.log('Client added:', result);

            // Reset form
            setNewClient({
                name: '',
                contact_info: '',
                contract_details: '',
            });

            // Refetch clients to update the list
            fetchClients();

        } catch (e) {
            console.error("Failed to add client:", e);
            setError(`Failed to add client: ${e.message}`);
            alert(`Error: ${e.message}`); // Show error to user
        } finally {
             setIsLoading(false); // Optional: stop loading indicator
        }
    };

    // New handler to add projects
    // SQL: INSERT INTO projects (client_id, name, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING project_id;
    const handleAddProject = async (e) => {
        e.preventDefault();
        if (!newProject.name || !newProject.client_id) {
            alert('Project Name and Client are required.');
            return;
        }
        // Consider adding loading/error state specific to this form
        try {
            const response = await fetch('http://localhost:3000/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to add project: ${errorData}`);
            }
            setNewProject({ client_id: '', name: '', start_date: '', end_date: '', status: 'Planned' }); // Reset form
            fetchProjects(); // Refetch projects
            alert('Project added successfully!');
        } catch (err) {
            console.error("Failed to add project:", err);
            alert(`Error adding project: ${err.message}`);
        }
    };

     // New handler to add staff
    // SQL: INSERT INTO staff (name, email, role) VALUES ($1, $2, $3) RETURNING staff_id;
    const handleAddStaff = async (e) => {
        e.preventDefault();
        if (!newStaff.name) {
            alert('Staff Name is required.');
            return;
        }
        // Consider adding loading/error state specific to this form
        try {
            const response = await fetch('http://localhost:3000/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStaff),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to add staff: ${errorData}`);
            }
            setNewStaff({ name: '', email: '', role: '' }); // Reset form
            fetchStaff(); // Refetch staff
            alert('Staff added successfully!');
        } catch (err) {
            console.error("Failed to add staff:", err);
            alert(`Error adding staff: ${err.message}`);
        }
    };

    // SQL: INSERT INTO resources (type, project_id, amount) VALUES ($1, $2, $3) RETURNING resource_id;
    const handleAddResource = async (e) => {
        e.preventDefault();
        if (!newResource.type || !newResource.amount) {
            alert('Resource Type and Amount are required.');
            return;
        }
        if (isNaN(parseFloat(newResource.amount)) || !isFinite(newResource.amount) || newResource.amount < 0) {
            alert('Invalid amount.');
            return;
        }
        // Add loading/error state if needed
        try {
            console.log('Adding resource:', newResource); // Debugging line
            const response = await fetch('http://localhost:3000/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newResource), // newResource now includes type, project_id, amount
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to add resource: ${errorData}`);
            }
            setNewResource({ type: '', project_id: '', amount: '' }); // Reset form
            fetchResources(); // Refetch
            alert('Resource added successfully!');
        } catch (err) {
            console.error("Failed to add resource:", err);
            alert(`Error adding resource: ${err.message}`);
        }
    };

    // Removed handleAddInvoice

    // SQL: INSERT INTO payments (project_id, payment_date, amount_paid, details) VALUES ($1, $2, $3, $4) RETURNING payment_id;
    const handleAddPayment = async (e) => {
        e.preventDefault();
        if (!newPayment.project_id || !newPayment.payment_date || !newPayment.amount_paid) {
            alert('Project, Payment Date, and Amount Paid are required.');
            return;
        }
        if (isNaN(parseFloat(newPayment.amount_paid)) || !isFinite(newPayment.amount_paid) || newPayment.amount_paid <= 0) {
            alert('Invalid amount paid. Must be a positive number.');
            return;
        }
        setIsPaymentsLoading(true);
        setPaymentsError(null);
        try {
            const response = await fetch('http://localhost:3000/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPayment),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to add payment: ${errorData}`);
            }
            setNewPayment({ project_id: '', payment_date: '', amount_paid: '', details: '' }); // Reset form
            fetchPayments(); // Refetch payments
            alert('Payment recorded successfully!');
        } catch (err) {
            console.error("Failed to add payment:", err);
            setPaymentsError(`Error adding payment: ${err.message}`);
            alert(`Error adding payment: ${err.message}`);
        } finally {
            setIsPaymentsLoading(false);
        }
    };

    // SQL: INSERT INTO tasks (project_id, title, deadline, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING task_id;
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.project_id) {
            alert('Task Title and Project are required.');
            return;
        }
        // Basic priority validation (if provided)
        if (newTask.priority && (isNaN(parseInt(newTask.priority)) || parseInt(newTask.priority) < 0)) {
            alert('Priority must be a non-negative number.');
            return;
        }

        setIsTasksLoading(true); // Use task-specific loading
        setTasksError(null);

        try {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to add task: ${errorData}`);
            }
            setNewTask({ project_id: '', title: '', deadline: '', priority: '', status: 'Not Started' }); // Reset form
            fetchTasks(); // Refetch tasks
            alert('Task added successfully!');
        } catch (err) {
            console.error("Failed to add task:", err);
            setTasksError(`Error adding task: ${err.message}`);
            alert(`Error adding task: ${err.message}`);
        } finally {
            setIsTasksLoading(false);
        }
    };

    // SQL: INSERT INTO task_assignments (task_id, staff_id) VALUES ($1, $2) RETURNING assignment_id;
    const handleAddTaskAssignment = async (e) => {
        e.preventDefault();
        if (!newTaskAssignment.task_id || !newTaskAssignment.staff_id) {
            alert('Task and Staff are required for assignment.');
            return;
        }
        setIsTaskAssignmentsLoading(true);
        setTaskAssignmentsError(null);
        try {
            const response = await fetch('http://localhost:3000/task_assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTaskAssignment),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to add task assignment: ${errorData}`);
            }
            setNewTaskAssignment({ task_id: '', staff_id: '' }); // Reset form
            fetchTaskAssignments(); // Refetch assignments
            alert('Task assignment recorded successfully!');
        } catch (err) {
            console.error("Failed to add task assignment:", err);
            setTaskAssignmentsError(`Error recording assignment: ${err.message}`);
            alert(`Error recording assignment: ${err.message}`);
        } finally {
            setIsTaskAssignmentsLoading(false);
        }
    };


    // Filter for ongoing projects (Planned, Active, On-Hold)
    const ongoingProjects = projects.filter(project =>
        ['Planned', 'Active', 'On‑Hold'].includes(project.status)
    );

    // --- Financial Calculation Effect ---
    useEffect(() => {
        let filteredProjects = [];
        if (selectedFinancialStatus === 'Ongoing') {
            filteredProjects = projects.filter(p => ['Active', 'On‑Hold'].includes(p.status));
        } else if (selectedFinancialStatus === 'Completed') {
            filteredProjects = projects.filter(p => p.status === 'Completed');
        } else if (selectedFinancialStatus === 'Not Started') {
            filteredProjects = projects.filter(p => p.status === 'Planned');
        }

        let newTotalRevenue = 0;
        let newTotalCost = 0;
        const newProjectsBreakdown = filteredProjects.map(project => {
            const projectPayments = payments.filter(pay => pay.project_id === project.project_id);
            const projectRevenue = projectPayments.reduce((sum, pay) => sum + parseFloat(pay.amount_paid || 0), 0);

            const projectResources = resources.filter(res => res.project_id === project.project_id);
            const projectCost = projectResources.reduce((sum, res) => sum + parseFloat(res.amount || 0), 0);
            
            const projectProfit = projectRevenue - projectCost;

            newTotalRevenue += projectRevenue;
            newTotalCost += projectCost;

            return {
                id: project.project_id,
                name: project.name,
                client_name: project.client_name,
                revenue: projectRevenue,
                cost: projectCost,
                profit: projectProfit,
            };
        });

        setFinancialSummary({
            totalRevenue: newTotalRevenue,
            totalCost: newTotalCost,
            totalProfit: newTotalRevenue - newTotalCost,
            projectsBreakdown: newProjectsBreakdown,
        });

    }, [selectedFinancialStatus, projects, resources, payments]);


    // --- JSX ---
    return (
        <div className={styles.dashboardContainer}>
            <h1>Admin Dashboard</h1>

            {/* Financial Overview Section - REMOVED FROM TOP */}

            <div className={styles.columnsContainer}>

                {/* Column 1: Clients & Projects */}
                <div className={styles.column}>
                    <h2 className={styles.sectionTitle}>Client & Project Management</h2>

                    {/* Client Section */}
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <h3 className={styles.subSectionTitle}>Create New Client</h3>
                    <form onSubmit={handleAddClient} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name:</label>
                            <input type="text" name="name" value={newClient.name} onChange={handleClientInputChange} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Contact Info:</label>
                            <input type="text" name="contact_info" value={newClient.contact_info} onChange={handleClientInputChange} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Contract Details:</label>
                            <textarea name="contract_details" value={newClient.contract_details} onChange={handleClientInputChange} rows="3" className={styles.textarea} />
                        </div>
                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Client'}
                        </button>
                    </form>

                    <h3 className={styles.subSectionTitle}>Client List</h3>
                    {isLoading && clients.length === 0 && <p className={styles.loadingMessage}>Loading clients...</p>}
                    {!isLoading && clients.length === 0 && !error && <p className={styles.noDataMessage}>No clients found.</p>}
                    {clients.length > 0 && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Client ID</th>
                                    <th>Name</th>
                                    <th>Contact Info</th>
                                    <th>Contract Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client) => (
                                    <tr key={client.client_id}>
                                        <td>{client.client_id}</td>
                                        <td>{client.name}</td>
                                        <td>{client.contact_info}</td>
                                        <td>{client.contract_details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <hr className={styles.hr} />

                    {/* Project Section */}
                    <h3 className={styles.subSectionTitle}>Create New Project</h3>
                     <form onSubmit={handleAddProject} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Project Name:</label>
                            <input type="text" name="name" value={newProject.name} onChange={handleProjectInputChange} required className={styles.input} />
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Client:</label>
                            <select name="client_id" value={newProject.client_id} onChange={handleProjectInputChange} required className={styles.select}>
                                <option value="">Select Client</option>
                                {clients.map(client => (
                                    <option key={client.client_id} value={client.client_id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Start Date:</label>
                            <input type="date" name="start_date" value={newProject.start_date} onChange={handleProjectInputChange} className={styles.input} />
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>End Date:</label>
                            <input type="date" name="end_date" value={newProject.end_date} onChange={handleProjectInputChange} className={styles.input} />
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Status:</label>
                            <select name="status" value={newProject.status} onChange={handleProjectInputChange} className={styles.select}>
                                <option value="Planned">Planned</option>
                                <option value="Active">Active</option>
                                <option value="On‑Hold">On-Hold</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.button}>Add Project</button>
                    </form>


                    <h3 className={styles.subSectionTitle}>Ongoing Projects</h3>
                    {projectsError && <p className={styles.errorMessage}>{projectsError}</p>}
                    {isProjectsLoading && <p className={styles.loadingMessage}>Loading projects...</p>}
                    {!isProjectsLoading && ongoingProjects.length === 0 && !projectsError && <p className={styles.noDataMessage}>No ongoing projects found.</p>}
                    {ongoingProjects.length > 0 && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Project Name</th>
                                    <th>Client</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ongoingProjects.map((project) => (
                                    <tr key={project.project_id}>
                                        <td>{project.project_id}</td>
                                        <td>{project.name}</td>
                                        <td>{project.client_name || 'N/A'}</td>
                                        <td>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</td>
                                        <td>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</td>
                                        <td>{project.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Column 2: Staff & Resources */}
                <div className={styles.column}>
                    <h2 className={styles.sectionTitle}>Staff Management</h2>

                    {/* Add Staff Form */}
                    <h3 className={styles.subSectionTitle}>Add New Staff</h3>
                    {staffError && <p className={styles.errorMessage}>{staffError}</p>}
                    <form onSubmit={handleAddStaff} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name:</label>
                            <input type="text" name="name" value={newStaff.name} onChange={handleStaffInputChange} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email:</label>
                            <input type="email" name="email" value={newStaff.email} onChange={handleStaffInputChange} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Role:</label>
                            <input type="text" name="role" value={newStaff.role} onChange={handleStaffInputChange} className={styles.input} />
                        </div>
                        <button type="submit" className={styles.button} disabled={isStaffLoading}>
                             {isStaffLoading ? 'Adding...' : 'Add Staff'}
                        </button>
                    </form>

                    {/* Staff List */}
                    <h3 className={styles.subSectionTitle}>Staff List</h3>
                    {isStaffLoading && <p className={styles.loadingMessage}>Loading staff...</p>}
                    {!isStaffLoading && staff.length === 0 && !staffError && <p className={styles.noDataMessage}>No staff found.</p>}
                    {staff.length > 0 && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Staff ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map((member) => (
                                    <tr key={member.staff_id}>
                                        <td>{member.staff_id}</td>
                                        <td>{member.name}</td>
                                        <td>{member.email || 'N/A'}</td>
                                        <td>{member.role || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <hr className={styles.hr} />

                    {/* Resource Management Section */}
                    <h2 className={styles.sectionTitle}>Resource Management</h2>
                    <h3 className={styles.subSectionTitle}>Add New Resource</h3>
                    {resourcesError && <p className={styles.errorMessage}>{resourcesError}</p>}
                    <form onSubmit={handleAddResource} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Type:</label>
                            {/* Consider making this a dropdown (e.g., People, Equipment, Software) */}
                            <input type="text" name="type" value={newResource.type} onChange={handleResourceInputChange} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Project:</label>
                            <select name="project_id" value={newResource.project_id} onChange={handleResourceInputChange} className={styles.select}>
                                <option value="">Select Project (Optional)</option>
                                {projects.map(project => (
                                    <option key={project.project_id} value={project.project_id}>
                                        {project.name} (Client: {project.client_name || 'N/A'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Amount ($):</label>
                            <input type="number" step="0.01" name="amount" value={newResource.amount} onChange={handleResourceInputChange} required className={styles.input} />
                        </div>
                        <button type="submit" className={styles.button} disabled={isResourcesLoading}>
                            {isResourcesLoading ? 'Adding...' : 'Add Resource'}
                        </button>
                    </form>

                    <h3 className={styles.subSectionTitle}>Resource List</h3>
                    {isResourcesLoading && <p className={styles.loadingMessage}>Loading resources...</p>}
                    {!isResourcesLoading && resources.length === 0 && !resourcesError && <p className={styles.noDataMessage}>No resources found.</p>}
                    {resources.length > 0 && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Project</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map((res) => (
                                    <tr key={res.resource_id}>
                                        <td>{res.resource_id}</td>
                                        <td>{res.type}</td>
                                        <td>{res.project_name || 'N/A'}</td>
                                        <td>{res.amount !== null ? `$${Number(res.amount).toFixed(2)}` : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                    <hr className={styles.hr} />

                    {/* Task Management Section */}
                    <h2 className={styles.sectionTitle}>Task Management</h2>
                    <h3 className={styles.subSectionTitle}>Add New Task</h3>
                    {tasksError && <p className={styles.errorMessage}>{tasksError}</p>}
                    <form onSubmit={handleAddTask} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Project:</label>
                            <select name="project_id" value={newTask.project_id} onChange={handleTaskInputChange} required className={styles.select}>
                                <option value="">Select Project</option>
                                {projects.map(project => (
                                    <option key={project.project_id} value={project.project_id}>
                                        {project.name} (Client: {project.client_name || 'N/A'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Task Title:</label>
                            <input type="text" name="title" value={newTask.title} onChange={handleTaskInputChange} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Deadline:</label>
                            <input type="date" name="deadline" value={newTask.deadline} onChange={handleTaskInputChange} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Priority:</label>
                            <input type="number" name="priority" value={newTask.priority} onChange={handleTaskInputChange} placeholder="e.g., 1 (High)" className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Status:</label>
                            <select name="status" value={newTask.status} onChange={handleTaskInputChange} className={styles.select}>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.button} disabled={isTasksLoading}>
                            {isTasksLoading ? 'Adding Task...' : 'Add Task'}
                        </button>
                    </form>

                    <h3 className={styles.subSectionTitle}>Task List</h3>
                    {isTasksLoading && tasks.length === 0 && <p className={styles.loadingMessage}>Loading tasks...</p>}
                    {!isTasksLoading && tasks.length === 0 && !tasksError && <p className={styles.noDataMessage}>No tasks found.</p>}
                    {tasks.length > 0 && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Project</th>
                                    <th>Deadline</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.task_id}>
                                        <td>{task.task_id}</td>
                                        <td>{task.title}</td>
                                        <td>{task.project_name || 'N/A'}</td>
                                        <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</td>
                                        <td>{task.priority !== null ? task.priority : 'N/A'}</td>
                                        <td>{task.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Task Assignment Management Section - MOVED HERE */}
                    <h3 className={styles.subSectionTitle}>Assign Task to Staff</h3>
                    {taskAssignmentsError && <p className={styles.errorMessage}>{taskAssignmentsError}</p>}
                    <form onSubmit={handleAddTaskAssignment} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Task:</label>
                            <select name="task_id" value={newTaskAssignment.task_id} onChange={handleTaskAssignmentInputChange} required className={styles.select}>
                                <option value="">Select Task</option>
                                {tasks.map(task => (
                                    <option key={task.task_id} value={task.task_id}>
                                        {task.title} (Project: {task.project_name})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Staff:</label>
                            <select name="staff_id" value={newTaskAssignment.staff_id} onChange={handleTaskAssignmentInputChange} required className={styles.select}>
                                <option value="">Select Staff</option>
                                {staff.map(member => (
                                    <option key={member.staff_id} value={member.staff_id}>
                                        {member.name} ({member.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className={styles.button} disabled={isTaskAssignmentsLoading}>
                            {isTaskAssignmentsLoading ? 'Assigning...' : 'Assign Task'}
                        </button>
                    </form>

                    <h3 className={styles.subSectionTitle}>Task Assignment List</h3>
                    {isTaskAssignmentsLoading && <p className={styles.loadingMessage}>Loading assignments...</p>}
                    {!isTaskAssignmentsLoading && taskAssignments.length === 0 && !taskAssignmentsError && <p className={styles.noDataMessage}>No task assignments found.</p>}
                    {taskAssignments.length > 0 && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    {/* <th>Assignment ID</th> Removed */}
                                    <th>Task</th>
                                    <th>Staff</th>
                                    {/* <th>Assigned On</th> Removed */}
                                </tr>
                            </thead>
                            <tbody>
                                {taskAssignments.map((assignment) => (
                                    <tr key={assignment.assignment_id}> {/* Assuming assignment_id is still available for the key */}
                                        {/* <td>{assignment.assignment_id}</td> Removed */}
                                        <td>{assignment.task_title}</td>
                                        <td>{assignment.staff_name}</td>
                                        {/* <td>{new Date(assignment.assigned_on).toLocaleDateString()}</td> Removed */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                 {/* Column 3: Payments */}
                 <div className={styles.column}>
                    <h2 className={styles.sectionTitle}>Payments</h2>

                    {/* Record New Payment Form */}
                    <h3 className={styles.subSectionTitle}>Record New Payment</h3>
                    {paymentsError && <p className={styles.errorMessage}>{paymentsError}</p>}
                     <form onSubmit={handleAddPayment} className={styles.form}>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Project:</label>
                            <select name="project_id" value={newPayment.project_id} onChange={handlePaymentInputChange} required className={styles.select}>
                                <option value="">Select Project</option>
                                {projects.map(project => (
                                    <option key={project.project_id} value={project.project_id}>
                                        {project.name} (Client: {project.client_name || 'N/A'})
                                    </option>
                                ))}
                            </select>
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Payment Date:</label>
                            <input type="date" name="payment_date" value={newPayment.payment_date} onChange={handlePaymentInputChange} required className={styles.input} />
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Amount Paid ($):</label>
                            <input type="number" step="0.01" name="amount_paid" value={newPayment.amount_paid} onChange={handlePaymentInputChange} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Details:</label>
                            <textarea name="details" value={newPayment.details} onChange={handlePaymentInputChange} rows="3" className={styles.textarea} />
                        </div>
                        <button type="submit" className={styles.button} disabled={isPaymentsLoading}>
                            {isPaymentsLoading ? 'Recording...' : 'Record Payment'}
                        </button>
                    </form>

                    {/* Payment List */}
                    <h3 className={styles.subSectionTitle}>Payment List</h3>
                    {isPaymentsLoading && payments.length === 0 && <p className={styles.loadingMessage}>Loading payments...</p>}
                    {!isPaymentsLoading && payments.length === 0 && !paymentsError && <p className={styles.noDataMessage}>No payments found.</p>}
                    {payments.length > 0 && (
                         <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Project</th>
                                    <th>Payment Date</th>
                                    <th>Amount Paid</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((pay) => (
                                    <tr key={pay.payment_id}>
                                        <td>{pay.payment_id}</td>
                                        <td>{pay.project_name || 'N/A'}</td>
                                        <td>{new Date(pay.payment_date).toLocaleDateString()}</td>
                                        <td>${Number(pay.amount_paid).toFixed(2)}</td>
                                        <td>{pay.details || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                     {/* Removed Invoice List and related hr tag */}
                </div>

            </div>

            {/* Financial Overview Section - RESTORED TO BOTTOM & ORIGINAL CONTENT */}
            <div className={styles.financialOverviewSection}>
                <h2 className={styles.sectionTitle}>Financial Overview</h2>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="financialStatusFilter">Filter by Project Status:</label>
                    <select
                        id="financialStatusFilter"
                        name="financialStatusFilter"
                        value={selectedFinancialStatus}
                        onChange={(e) => setSelectedFinancialStatus(e.target.value)}
                        className={styles.select}
                    >
                        <option value="Ongoing">Ongoing (Active, On-Hold)</option>
                        <option value="Completed">Completed</option>
                        <option value="Not Started">Not Started (Planned)</option>
                    </select>
                </div>

                {financialSummary.projectsBreakdown.length > 0 || financialSummary.totalRevenue > 0 || financialSummary.totalCost > 0 ? (
                    <>
                        {financialSummary.projectsBreakdown.length > 0 && (
                            <>
                                <h3 className={styles.subSectionTitle}>Projects Breakdown ({selectedFinancialStatus})</h3>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Project Name</th>
                                            <th>Client</th>
                                            <th>Revenue</th>
                                            <th>Cost</th>
                                            <th>Profit/Loss</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {financialSummary.projectsBreakdown.map(proj => (
                                            <tr key={proj.id}>
                                                <td>{proj.name}</td>
                                                <td>{proj.client_name || 'N/A'}</td>
                                                <td>${proj.revenue.toFixed(2)}</td>
                                                <td>${proj.cost.toFixed(2)}</td>
                                                <td style={{ color: proj.profit < 0 ? '#F44336' : '#4CAF50' }}>
                                                    ${proj.profit.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                        <h3 className={styles.subSectionTitle} style={{ marginTop: financialSummary.projectsBreakdown.length > 0 ? '20px' : '0px' }}>
                            Summary for {selectedFinancialStatus} Projects
                        </h3>
                        <div className={styles.summaryMetrics}>
                            <p>Total Revenue: <strong>${financialSummary.totalRevenue.toFixed(2)}</strong></p>
                            <p>Total Cost: <strong>${financialSummary.totalCost.toFixed(2)}</strong></p>
                            <p>Total Profit/Loss: <strong style={{ color: financialSummary.totalProfit < 0 ? '#F44336' : '#4CAF50' }}>
                                ${financialSummary.totalProfit.toFixed(2)}
                            </strong></p>
                        </div>
                    </>
                ) : (
                    <p className={styles.noDataMessage}>No projects found for "{selectedFinancialStatus}" status or no financial data available.</p>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;