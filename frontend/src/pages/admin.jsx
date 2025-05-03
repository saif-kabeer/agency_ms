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
    const [newResource, setNewResource] = useState({ name: '', type: '', cost_per_unit: '' });
    const [isResourcesLoading, setIsResourcesLoading] = useState(false);
    const [resourcesError, setResourcesError] = useState(null);

    // New State for Invoices & Payments
    const [invoices, setInvoices] = useState([]);
    const [newInvoice, setNewInvoice] = useState({ client_id: '', project_id: '', issue_date: '', due_date: '', total_amount: '', status: 'Draft' });
    const [isInvoicesLoading, setIsInvoicesLoading] = useState(false);
    const [invoicesError, setInvoicesError] = useState(null);
    const [payments, setPayments] = useState([]); // Just for listing initially
    const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState(null);


    // --- Fetching Functions ---
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

    const fetchInvoices = async () => {
        setIsInvoicesLoading(true);
        setInvoicesError(null);
        try {
            const response = await fetch('http://localhost:3000/invoices');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setInvoices(data);
        } catch (e) {
            console.error("Failed to fetch invoices:", e);
            setInvoicesError('Failed to load invoices.');
        } finally {
            setIsInvoicesLoading(false);
        }
    };

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

    // Fetch all data on component mount
    useEffect(() => {
        fetchClients();
        fetchProjects();
        fetchStaff();
        fetchResources();
        fetchInvoices();
        fetchPayments();
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

    const handleInvoiceInputChange = (e) => {
        const { name, value } = e.target;
        setNewInvoice((prev) => ({ ...prev, [name]: value }));
    };


    // --- Add Handlers ---
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

    const handleAddResource = async (e) => {
        e.preventDefault();
        if (!newResource.name || !newResource.type) {
            alert('Resource Name and Type are required.');
            return;
        }
        // Add loading/error state if needed
        try {
            const response = await fetch('http://localhost:3000/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newResource),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to add resource: ${errorData}`);
            }
            setNewResource({ name: '', type: '', cost_per_unit: '' }); // Reset form
            fetchResources(); // Refetch
            alert('Resource added successfully!');
        } catch (err) {
            console.error("Failed to add resource:", err);
            alert(`Error adding resource: ${err.message}`);
        }
    };

    const handleAddInvoice = async (e) => {
        e.preventDefault();
        if (!newInvoice.client_id || !newInvoice.issue_date || !newInvoice.due_date || !newInvoice.total_amount) {
            alert('Client, Issue Date, Due Date, and Total Amount are required.');
            return;
        }
         // Add loading/error state if needed
        try {
            const response = await fetch('http://localhost:3000/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newInvoice),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to add invoice: ${errorData}`);
            }
            setNewInvoice({ client_id: '', project_id: '', issue_date: '', due_date: '', total_amount: '', status: 'Draft' }); // Reset form
            fetchInvoices(); // Refetch
            alert('Invoice added successfully!');
        } catch (err) {
            console.error("Failed to add invoice:", err);
            alert(`Error adding invoice: ${err.message}`);
        }
    };


    // Filter for ongoing projects (Planned, Active, On-Hold)
    const ongoingProjects = projects.filter(project =>
        ['Planned', 'Active', 'On‑Hold'].includes(project.status)
    );

    // --- JSX ---
    return (
        <div className={styles.dashboardContainer}>
            <h1>Admin Dashboard</h1>

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
                            <label className={styles.label}>Resource Name:</label>
                            <input type="text" name="name" value={newResource.name} onChange={handleResourceInputChange} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Type:</label>
                            {/* Consider making this a dropdown (e.g., People, Equipment, Software) */}
                            <input type="text" name="type" value={newResource.type} onChange={handleResourceInputChange} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Cost Per Unit (Optional):</label>
                            <input type="number" step="0.01" name="cost_per_unit" value={newResource.cost_per_unit} onChange={handleResourceInputChange} className={styles.input} />
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
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Cost/Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map((res) => (
                                    <tr key={res.resource_id}>
                                        <td>{res.resource_id}</td>
                                        <td>{res.name}</td>
                                        <td>{res.type}</td>
                                        <td>{res.cost_per_unit !== null ? `$${Number(res.cost_per_unit).toFixed(2)}` : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                 {/* Column 3: Invoicing & Payments */}
                 <div className={styles.column}>
                    <h2 className={styles.sectionTitle}>Invoicing & Payments</h2>

                    {/* Add Invoice Form */}
                    <h3 className={styles.subSectionTitle}>Create New Invoice</h3>
                    {invoicesError && <p className={styles.errorMessage}>{invoicesError}</p>}
                     <form onSubmit={handleAddInvoice} className={styles.form}>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Client:</label>
                            <select name="client_id" value={newInvoice.client_id} onChange={handleInvoiceInputChange} required className={styles.select}>
                                <option value="">Select Client</option>
                                {clients.map(client => (
                                    <option key={client.client_id} value={client.client_id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Project (Optional):</label>
                            <select name="project_id" value={newInvoice.project_id} onChange={handleInvoiceInputChange} className={styles.select}>
                                <option value="">Select Project (Optional)</option>
                                {projects.map(project => (
                                    <option key={project.project_id} value={project.project_id}>{project.name} (Client: {project.client_name})</option>
                                ))}
                            </select>
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Issue Date:</label>
                            <input type="date" name="issue_date" value={newInvoice.issue_date} onChange={handleInvoiceInputChange} required className={styles.input} />
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Due Date:</label>
                            <input type="date" name="due_date" value={newInvoice.due_date} onChange={handleInvoiceInputChange} required className={styles.input} />
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Total Amount ($):</label>
                            <input type="number" step="0.01" name="total_amount" value={newInvoice.total_amount} onChange={handleInvoiceInputChange} required className={styles.input} />
                        </div>
                         <div className={styles.formGroup}>
                            <label className={styles.label}>Status:</label>
                            <select name="status" value={newInvoice.status} onChange={handleInvoiceInputChange} className={styles.select}>
                                <option value="Draft">Draft</option>
                                <option value="Sent">Sent</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.button} disabled={isInvoicesLoading}>
                            {isInvoicesLoading ? 'Creating...' : 'Create Invoice'}
                        </button>
                    </form>

                    {/* Invoice List */}
                    <h3 className={styles.subSectionTitle}>Invoice List</h3>
                    {isInvoicesLoading && <p className={styles.loadingMessage}>Loading invoices...</p>}
                    {!isInvoicesLoading && invoices.length === 0 && !invoicesError && <p className={styles.noDataMessage}>No invoices found.</p>}
                    {invoices.length > 0 && (
                         <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Client</th>
                                    <th>Project</th>
                                    <th>Issued</th>
                                    <th>Due</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.invoice_id}>
                                        <td>{inv.invoice_id}</td>
                                        <td>{inv.client_name}</td>
                                        <td>{inv.project_name || 'N/A'}</td>
                                        <td>{new Date(inv.issue_date).toLocaleDateString()}</td>
                                        <td>{new Date(inv.due_date).toLocaleDateString()}</td>
                                        <td>${Number(inv.total_amount).toFixed(2)}</td>
                                        <td>{inv.status}</td>
                                        {/* Add actions like 'View', 'Mark as Paid' later */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                     <hr className={styles.hr} />

                     {/* Payment List (Read-only for now) */}
                    <h3 className={styles.subSectionTitle}>Recent Payments</h3>
                     {paymentsError && <p className={styles.errorMessage}>{paymentsError}</p>}
                    {isPaymentsLoading && <p className={styles.loadingMessage}>Loading payments...</p>}
                    {!isPaymentsLoading && payments.length === 0 && !paymentsError && <p className={styles.noDataMessage}>No payments recorded.</p>}
                    {payments.length > 0 && (
                         <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Payment ID</th>
                                    <th>Invoice ID</th>
                                    <th>Client</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((pay) => (
                                    <tr key={pay.payment_id}>
                                        <td>{pay.payment_id}</td>
                                        <td>{pay.invoice_id}</td>
                                        <td>{pay.client_name}</td>
                                        <td>{new Date(pay.payment_date).toLocaleDateString()}</td>
                                        <td>${Number(pay.amount).toFixed(2)}</td>
                                        <td>{pay.method || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;