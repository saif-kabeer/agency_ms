-- ============================================================================
--  Agency Project‑Management System  |  MySQL / MariaDB 10.4+
-- ============================================================================

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

CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id  INT,
    type   VARCHAR(60) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE payments (
    payment_id   INT AUTO_INCREMENT PRIMARY KEY,
    project_id   INT,
    payment_date DATE NOT NULL,
    amount_paid  DECIMAL(12,2) NOT NULL,
    details      TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    password TEXT NOT NULL      -- store hashed passwords later
) ENGINE = InnoDB;
