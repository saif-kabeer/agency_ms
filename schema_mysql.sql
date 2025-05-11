-- Create `clients` table if it doesn't exist
CREATE TABLE IF NOT EXISTS `clients` (
    `client_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `contact_info` VARCHAR(255),
    `contract_details` TEXT
);

-- Create `projects` table if it doesn't exist
CREATE TABLE IF NOT EXISTS `projects` (
    `project_id` INT AUTO_INCREMENT PRIMARY KEY,
    `client_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `start_date` DATE,
    `end_date` DATE,
    `status` ENUM('Planned', 'Active', 'On‑Hold', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Planned',
    FOREIGN KEY (`client_id`) REFERENCES `clients`(`client_id`) ON DELETE CASCADE
);

-- Create `staff` table if it doesn't exist
CREATE TABLE IF NOT EXISTS `staff` (
    `staff_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE,
    `role` VARCHAR(100)
);

-- Create `resources` table if it doesn't exist
CREATE TABLE IF NOT EXISTS `resources` (
    `resource_id` INT AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(100) NOT NULL,
    `project_id` INT,
    `amount` DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE SET NULL
);

-- Create `payments` table if it doesn't exist
CREATE TABLE IF NOT EXISTS `payments` (
    `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `payment_date` DATE NOT NULL,
    `amount_paid` DECIMAL(10, 2) NOT NULL,
    `details` TEXT,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE CASCADE
);

-- Create `tasks` table if it doesn't exist
CREATE TABLE IF NOT EXISTS `tasks` (
    `task_id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `deadline` DATE,
    `priority` INT,
    `status` ENUM('Not Started', 'In Progress', 'Completed') NOT NULL DEFAULT 'Not Started',
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE CASCADE
);

-- Create `task_assignments` table if it doesn't exist
CREATE TABLE IF NOT EXISTS `task_assignments` (
    `assignment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT NOT NULL,
    `staff_id` INT NOT NULL,
    `approved` BOOLEAN DEFAULT TRUE,
    `assigned_on` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_task_staff` (`task_id`, `staff_id`)
);

-- Disable foreign key checks to empty tables
SET FOREIGN_KEY_CHECKS=0;

-- Empty existing tables (order matters if FK checks were on, but safe with them off)
DELETE FROM `task_assignments`;
DELETE FROM `tasks`;
DELETE FROM `payments`;
DELETE FROM `resources`;
DELETE FROM `projects`;
DELETE FROM `staff`;
DELETE FROM `clients`;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Reset AUTO_INCREMENT values for tables
ALTER TABLE `clients` AUTO_INCREMENT = 1;
ALTER TABLE `staff` AUTO_INCREMENT = 1;
ALTER TABLE `projects` AUTO_INCREMENT = 1;
ALTER TABLE `resources` AUTO_INCREMENT = 1;
ALTER TABLE `payments` AUTO_INCREMENT = 1;
ALTER TABLE `tasks` AUTO_INCREMENT = 1;
ALTER TABLE `task_assignments` AUTO_INCREMENT = 1;

-- Populate `clients` table
INSERT INTO `clients` (`name`, `contact_info`, `contract_details`) VALUES
('Tech Solutions Inc.', 'contact@techsolutions.com', 'Standard Service Agreement, 12 months.'),
('GreenScape Landscaping', 'info@greenscape.com', 'Monthly maintenance contract.'),
('Foodie Heaven Restaurant', 'manager@foodieheaven.com', 'Marketing campaign agreement.');

-- Populate `staff` table
INSERT INTO `staff` (`name`, `email`, `role`) VALUES
('Alice Wonderland', 'alice@example.com', 'Project Manager'),
('Bob The Builder', 'bob@example.com', 'Lead Developer'),
('Carol Danvers', 'carol@example.com', 'Marketing Specialist'),
('David Copperfield', 'david@example.com', 'UX Designer');

-- Populate `projects` table
-- Ensure client_id values correspond to the newly inserted clients (IDs 1, 2, 3)
INSERT INTO `projects` (`client_id`, `name`, `start_date`, `end_date`, `status`) VALUES
(1, 'Website Redesign', '2024-01-15', '2024-06-30', 'Active'),
(1, 'Mobile App Development', '2024-03-01', '2024-09-30', 'Planned'),
(2, 'Spring Planting Campaign', '2024-04-01', '2024-05-31', 'Completed'),
(3, 'Social Media Blitz Q2', '2024-04-10', '2024-06-30', 'Active'),
(2, 'New Office Garden Design', '2024-07-01', '2024-08-15', 'Planned');

-- Populate `resources` table (costs)
-- Ensure project_id values correspond to newly inserted projects (IDs 1, 2, 3, 4, 5)
INSERT INTO `resources` (`type`, `project_id`, `amount`) VALUES
('Software Licensing', 1, 500.00),
('Cloud Hosting', 1, 150.00),
('Stock Photography', 1, 75.00),
('Development Tools', 2, 300.00),
('Gardening Supplies', 3, 250.00),
('Fertilizers', 3, 80.00),
('Ad Spend', 4, 1200.00),
('Design Software', 4, 90.00);

-- Populate `payments` table (revenue)
-- Ensure project_id values correspond to newly inserted projects
INSERT INTO `payments` (`project_id`, `payment_date`, `amount_paid`, `details`) VALUES
(1, '2024-01-20', 2000.00, 'Initial payment for Website Redesign'),
(1, '2024-03-15', 1500.00, 'Milestone 1 payment for Website Redesign'),
(3, '2024-04-05', 800.00, 'Payment for Spring Planting Campaign - Phase 1'),
(3, '2024-05-20', 750.00, 'Final payment for Spring Planting Campaign'),
(4, '2024-04-15', 1000.00, 'Retainer for Social Media Blitz Q2');

-- Populate `tasks` table
-- Ensure project_id values correspond to newly inserted projects
INSERT INTO `tasks` (`project_id`, `title`, `deadline`, `priority`, `status`) VALUES
(1, 'Initial Design Mockups', '2024-02-15', 1, 'Completed'),
(1, 'Frontend Development - Homepage', '2024-03-30', 1, 'In Progress'),
(1, 'Backend API Integration', '2024-04-30', 2, 'In Progress'),
(2, 'Requirement Gathering', '2024-03-20', 1, 'Not Started'),
(3, 'Soil Preparation', '2024-04-10', 1, 'Completed'),
(3, 'Planting Phase', '2024-04-25', 2, 'Completed'),
(4, 'Content Calendar Creation', '2024-04-20', 1, 'In Progress'),
(4, 'Ad Campaign Setup', '2024-04-30', 1, 'Not Started');

-- Populate `task_assignments` table
-- Ensure task_id and staff_id values correspond to newly inserted tasks and staff
INSERT INTO `task_assignments` (`task_id`, `staff_id`, `approved`) VALUES
(1, 4, TRUE), -- Design Mockups (Task ID 1) to David (Staff ID 4)
(2, 2, TRUE), -- Frontend Homepage (Task ID 2) to Bob (Staff ID 2)
(3, 2, TRUE), -- Backend API (Task ID 3) to Bob (Staff ID 2)
(4, 1, TRUE), -- Requirement Gathering (Task ID 4) to Alice (Staff ID 1)
(5, 1, TRUE), -- Soil Prep (Task ID 5) to Alice (Staff ID 1)
(6, 1, TRUE), -- Planting Phase (Task ID 6) to Alice (Staff ID 1)
(7, 3, TRUE), -- Content Calendar (Task ID 7) to Carol (Staff ID 3)
(8, 3, TRUE); -- Ad Campaign Setup (Task ID 8) to Carol (Staff ID 3)
