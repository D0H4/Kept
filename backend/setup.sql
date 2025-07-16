-- MySQL Database Setup Script
-- Execute this script after connecting to MySQL server

-- Create database
CREATE DATABASE IF NOT EXISTS kept CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user and grant privileges (if needed)
-- CREATE USER IF NOT EXISTS 'kept_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON kept.* TO 'kept_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Select database
USE kept;

-- Create memo table (automatically created by application, but can be created in advance)
CREATE TABLE IF NOT EXISTS memo (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO memo (title, content, is_pinned, is_archived, created_at, updated_at) VALUES 
('First Note', 'Hello! This is my first note.', FALSE, FALSE, '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
('Important Tasks', 'Project Deadline: December 31, 2024\n- Complete Frontend\n- Implement Backend API\n- Finish Testing', TRUE, FALSE, '2024-01-10 09:15:00', '2024-01-20 14:45:00'),
('Ideas', 'Record your new feature ideas here.\n- Dark mode support\n- Note search functionality\n- Tag system', FALSE, FALSE, '2024-01-18 16:20:00', '2024-01-18 16:20:00'),
('Archived Note', 'This note has been archived. Store reference materials here for later use.', FALSE, TRUE, '2024-01-05 11:00:00', '2024-01-12 13:30:00'),
('Meeting Notes', 'Today\'s meeting agenda:\n- Review project progress\n- Plan for next week\n- Assign team roles', FALSE, FALSE, '2024-01-22 15:00:00', '2024-01-22 15:00:00'),
('Development Tips', 'React Performance Optimization:\n- Use React.memo\n- Utilize useCallback\n- Prevent unnecessary re-renders', TRUE, FALSE, '2024-01-08 08:30:00', '2024-01-25 10:15:00');

-- Check table
SELECT * FROM memo; 