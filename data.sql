/* ===========================================================================
   RESET + SEED DATA  |  Agency Project‑Management System
   ---------------------------------------------------------------------------
   1) Clears all existing rows while keeping table structure intact
   2) Inserts fresh, consistent demo data
   ---------------------------------------------------------------------------
   Safe to re‑run any time you want a clean slate for testing.
   ===========================================================================
*/

-- 1 ▸ Empty every table (order matters because of FK constraints)
-- SET FOREIGN_KEY_CHECKS = 0;

-- TRUNCATE TABLE payments;
-- TRUNCATE TABLE task_assignments;
-- -- TRUNCATE TABLE tasks;
-- TRUNCATE TABLE resources;
-- TRUNCATE TABLE projects;
-- TRUNCATE TABLE clients;
-- TRUNCATE TABLE staff;
-- TRUNCATE TABLE admins;

-- SET FOREIGN_KEY_CHECKS = 1;


-- 2 ▸ Seed tables
/* === CLIENTS ============================================================= */
INSERT INTO clients (name, contact_info, contract_details) VALUES
  ('Acme Corp',   'acme@acme.com,  +1‑555‑0100', '12‑month web retainer'),
  ('Globex Inc',  'info@globex.com, +1‑555‑0200', 'Mobile app dev contract'),
  ('Stark Enterprises', 'tony@stark.com, +1‑555‑0300', 'Advanced R&D portal');

/* === PROJECTS ============================================================ */
INSERT INTO projects
  (client_id, name, start_date, end_date, status)
VALUES
  (1, 'Website Redesign',      '2025‑05‑01', '2025‑08‑15', 'Active'),
  (1, 'Brand Refresh',         '2025‑06‑10', '2025‑09‑30', 'Planned'),
  (2, 'Mobile App MVP',        '2025‑06‑01', '2025‑10‑30', 'Planned'),
  (3, 'AI Research Dashboard', '2025‑04‑15', '2025‑12‑20', 'Active');

/* === STAFF ============================================================== */
INSERT INTO staff (name, email, role) VALUES
  ('Jane Doe',       'jane.doe@example.com',    'Developer'),
  ('John Smith',     'john.smith@example.com',  'Project Manager'),
  ('Sara Lee',       'sara.lee@example.com',    'Designer'),
  ('Carlos Ramirez', 'carlos.r@example.com',    'QA Engineer'),
  ('Anita Patel',    'anita.patel@example.com', 'Account Manager');

/* === TASKS ============================================================== */
INSERT INTO tasks
  (project_id, title, deadline, priority, status)
VALUES
  (1, 'Build landing page',     '2025‑05‑20', 2, 'In Progress'),
  (1, 'Set up CMS backend',     '2025‑05‑25', 1, 'Not Started'),
  (2, 'Create mood‑boards',     '2025‑06‑18', 3, 'Not Started'),
  (3, 'Design app wire‑frames', '2025‑06‑15', 2, 'Not Started'),
  (4, 'Data‑ingest pipeline',   '2025‑05‑30', 1, 'In Progress'),
  (4, 'Model evaluation',       '2025‑06‑25', 1, 'Not Started');

/* === TASK ↔ STAFF ASSIGNMENTS (approval flag) =========================== */
INSERT INTO task_assignments (task_id, staff_id, approved) VALUES
  (1, 1, TRUE),   -- Jane on landing page
  (1, 3, TRUE),   -- Sara on landing page
  (2, 1, FALSE),  -- Jane on CMS backend (awaiting PM approval)
  (2, 2, TRUE),   -- John supervising CMS backend
  (3, 3, FALSE),  -- Sara on mood‑boards
  (4, 3, TRUE),   -- Sara on wire‑frames
  (4, 2, TRUE),   -- John PM
  (5, 1, TRUE),   -- Jane on pipeline
  (5, 4, TRUE),   -- Carlos QA pipeline
  (6, 1, TRUE);   -- Jane on model evaluation

/* === RESOURCES ========================================================== */
INSERT INTO resources (project_id, type, amount) VALUES
  (1, 'Dev‑Hours',           160.0),
  (1, 'Adobe CC Licence',     55.0),
  (2, 'Design‑Hours',        120.0),
  (3, 'Dev‑Hours',           250.0),
  (4, 'GPU Compute Hours',    80.0),
  (4, 'Cloud Storage (GB)',  500.0);

/* === PAYMENTS =========================================================== */
INSERT INTO payments (project_id, payment_date, amount_paid, details) VALUES
  (1, '2025‑05‑05',  7_500.00, 'Initial 25% deposit'),
  (4, '2025‑04‑30', 12_000.00, 'Phase 1 invoice');

/* === ADMINS ============================================================= */
-- Password column should store a bcrypt/argon hash in production.
INSERT INTO admins (username, password)
VALUES ('admin', 'SET_THIS_TO_A_HASH_BEFORE_PROD');


/* === QUICK VERIFICATION ================================================= */
SELECT 'clients' AS tbl, COUNT(*) AS rows FROM clients
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'staff', COUNT(*) FROM staff
UNION ALL SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL SELECT 'task_assignments', COUNT(*) FROM task_assignments
UNION ALL SELECT 'resources', COUNT(*) FROM resources
UNION ALL SELECT 'payments', COUNT(*) FROM payments;
