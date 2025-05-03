CREATE TABLE clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    contact_info TEXT,
    contract_details TEXT
) ENGINE = InnoDB;

CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id  INT,
    name       VARCHAR(150) NOT NULL,
    start_date DATE,
    end_date   DATE,
    status     ENUM('Planned','Active','On‑Hold','Completed','Cancelled')
               DEFAULT 'Planned',
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE,
    role  VARCHAR(40)
) ENGINE = InnoDB;

CREATE TABLE tasks (
    task_id   INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    title     VARCHAR(150) NOT NULL,
    deadline  DATE,
    priority  TINYINT,
    status    ENUM('Not Started','In Progress','Blocked','Completed')
              DEFAULT 'Not Started',
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE task_assignments (
    task_id  INT,
    staff_id INT,
    approved BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (task_id, staff_id),
    FOREIGN KEY (task_id)  REFERENCES tasks(task_id)  ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE resource_types (
     resource_type_id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL UNIQUE,
     type VARCHAR(60), -- e.g., 'Labor', 'Software', 'Hardware', 'Subscription'
     cost_per_unit DECIMAL(10, 2) -- e.g., cost per hour, per license, per month
) ENGINE=InnoDB;

CREATE TABLE payments (
    payment_id   INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id   INT NOT NULL, -- Changed from project_id
    payment_date DATE NOT NULL,
    amount       DECIMAL(12,2) NOT NULL, -- Renamed from amount_paid for consistency
    method       VARCHAR(50), -- e.g., 'Credit Card', 'Bank Transfer', 'Check'
    details      TEXT,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE -- Link to invoices
) ENGINE = InnoDB;

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    password TEXT NOT NULL      -- store hashed passwords later
) ENGINE = InnoDB;

CREATE TABLE invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    project_id INT, -- Can be NULL if invoice is not project-specific
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE RESTRICT, -- Prevent deleting client with invoices
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE SET NULL -- Allow deleting project but keep invoice
) ENGINE = InnoDB;
