CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- USERS
-- =========================

INSERT INTO users (email, password, is_admin, is_active)
VALUES
('admin@example.com', crypt('admin', gen_salt('bf')), TRUE, TRUE),
('alice@example.com', crypt('password123', gen_salt('bf')), FALSE, TRUE),
('bob@example.com', crypt('password123', gen_salt('bf')), FALSE, TRUE),
('charlie@example.com', crypt('password123', gen_salt('bf')), FALSE, TRUE),
('david@example.com', crypt('password123', gen_salt('bf')), FALSE, TRUE),
('inactive@example.com', crypt('password123', gen_salt('bf')), FALSE, FALSE);


-- =========================
-- COURSES
-- =========================

INSERT INTO courses (code, name, description)
VALUES
('JAVA101', 'Java Programming',
 'Introduction to Java programming and object-oriented programming.'),

('DB101', 'Database',
 'Introduction to relational databases and SQL.'),

('WEB101', 'Web Development',
 'Introduction to HTML, CSS, JavaScript and web development.'),

('ALGO101', 'Algorithms',
 'Introduction to algorithms, complexity and data structures.');


-- =========================
-- EXAMS
-- =========================

INSERT INTO exams
(course_id, name, description, start_date, end_date)
VALUES
(
    1,
    'Java Basics Exam',
    'Basic Java programming concepts.',
    '2026-09-01 09:00:00',
    '2026-09-01 11:00:00'
),
(
    1,
    'OOP Exam',
    'Object-oriented programming in Java.',
    '2026-09-10 09:00:00',
    '2026-09-10 11:00:00'
),
(
    2,
    'SQL Fundamentals',
    'Basic SQL queries and relational database concepts.',
    '2026-09-05 14:00:00',
    '2026-09-05 16:00:00'
),
(
    3,
    'Web Basics',
    'HTML, CSS and JavaScript fundamentals.',
    '2026-09-15 09:00:00',
    '2026-09-15 11:00:00'
),
(
    4,
    'Algorithms Exam',
    'Algorithms and complexity.',
    '2026-09-20 13:00:00',
    '2026-09-20 15:00:00'
);


-- =========================
-- QUESTIONS
-- =========================

INSERT INTO questions
(exam_id, statement, points)
VALUES
-- Java Basics (exam 1)
(1, 'Which keyword is used to create a class in Java?', 1),
(1, 'Which method is the entry point of a Java application?', 1),
(1, 'Which type is used to store a whole number?', 1),
(1, 'Which keyword is used to create an object?', 1),

-- OOP (exam 2)
(2, 'What is inheritance in object-oriented programming?', 2),
(2, 'Which keyword is used to inherit from a class in Java?', 1),
(2, 'What is encapsulation?', 2),

-- SQL (exam 3)
(3, 'Which SQL command is used to retrieve data?', 1),
(3, 'Which SQL clause is used to filter rows?', 1),
(3, 'Which keyword is used to sort query results?', 1),
(3, 'What does PRIMARY KEY identify?', 2),

-- Web (exam 4)
(4, 'What does HTML stand for?', 1),
(4, 'Which language is mainly used to style HTML pages?', 1),
(4, 'Which language is used to add interactivity to web pages?', 1),

-- Algorithms (exam 5)
(5, 'What is the complexity of binary search?', 2),
(5, 'Which data structure follows FIFO?', 1),
(5, 'Which data structure follows LIFO?', 1);


-- =========================
-- CHOICES
-- =========================

INSERT INTO choices
(question_id, choice_text, is_correct)
VALUES

-- Question 1
(1, 'class', TRUE),
(1, 'struct', FALSE),
(1, 'object', FALSE),
(1, 'define', FALSE),

-- Question 2
(2, 'main()', TRUE),
(2, 'start()', FALSE),
(2, 'run()', FALSE),
(2, 'execute()', FALSE),

-- Question 3
(3, 'int', TRUE),
(3, 'String', FALSE),
(3, 'boolean', FALSE),
(3, 'double', FALSE),

-- Question 4
(4, 'new', TRUE),
(4, 'create', FALSE),
(4, 'object', FALSE),
(4, 'instance', FALSE),

-- Question 5
(5, 'A class acquiring properties and methods from another class', TRUE),
(5, 'Deleting a class', FALSE),
(5, 'Creating a database', FALSE),
(5, 'Running multiple threads', FALSE),

-- Question 6
(6, 'extends', TRUE),
(6, 'implements', FALSE),
(6, 'inherits', FALSE),
(6, 'super', FALSE),

-- Question 7
(7, 'Hiding internal data and controlling access through methods', TRUE),
(7, 'Creating multiple databases', FALSE),
(7, 'Running a program faster', FALSE),
(7, 'Deleting unused objects', FALSE),

-- Question 8
(8, 'SELECT', TRUE),
(8, 'GET', FALSE),
(8, 'FETCH', FALSE),
(8, 'READ', FALSE),

-- Question 9
(9, 'WHERE', TRUE),
(9, 'FILTER', FALSE),
(9, 'HAVING', FALSE),
(9, 'SEARCH', FALSE),

-- Question 10
(10, 'ORDER BY', TRUE),
(10, 'SORT BY', FALSE),
(10, 'GROUP BY', FALSE),
(10, 'SORT', FALSE),

-- Question 11
(11, 'A unique row in a table', TRUE),
(11, 'A database', FALSE),
(11, 'A SQL query', FALSE),
(11, 'A column type', FALSE),

-- Question 12
(12, 'HyperText Markup Language', TRUE),
(12, 'HighText Machine Language', FALSE),
(12, 'HyperTransfer Markup Language', FALSE),
(12, 'Home Tool Markup Language', FALSE),

-- Question 13
(13, 'CSS', TRUE),
(13, 'SQL', FALSE),
(13, 'Java', FALSE),
(13, 'PHP', FALSE),

-- Question 14
(14, 'JavaScript', TRUE),
(14, 'HTML', FALSE),
(14, 'CSS', FALSE),
(14, 'SQL', FALSE),

-- Question 15
(15, 'O(log n)', TRUE),
(15, 'O(n)', FALSE),
(15, 'O(n²)', FALSE),
(15, 'O(1)', FALSE),

-- Question 16
(16, 'Queue', TRUE),
(16, 'Stack', FALSE),
(16, 'Tree', FALSE),
(16, 'Graph', FALSE),

-- Question 17
(17, 'Stack', TRUE),
(17, 'Queue', FALSE),
(17, 'Tree', FALSE),
(17, 'Graph', FALSE);


-- =========================
-- ATTEMPTS
-- =========================

INSERT INTO attempts
(student_id, exam_id, score, total_points, submitted_at)
VALUES
-- Alice
(2, 1, 4, 4, '2026-09-01 10:30:00'),
(2, 3, 4, 5, '2026-09-05 15:30:00'),

-- Bob
(3, 1, 3, 4, '2026-09-01 10:45:00'),
(3, 2, 4, 5, '2026-09-10 10:20:00'),

-- Charlie
(4, 1, 2, 4, '2026-09-01 10:50:00'),

-- David
(5, 3, 3, 5, '2026-09-05 15:45:00');


-- =========================
-- ANSWERS
-- =========================

INSERT INTO answers
(attempt_id, question_id, choice_id)
VALUES

-- Alice - Java Basics
(1, 1, 1),
(1, 2, 5),
(1, 3, 9),
(1, 4, 13),

-- Alice - SQL
(2, 8, 17),
(2, 9, 21),
(2, 10, 25),
(2, 11, 29),

-- Bob - Java Basics
(3, 1, 1),
(3, 2, 5),
(3, 3, 9),
(3, 4, 14),

-- Bob - OOP
(4, 5, 33),
(4, 6, 37),
(4, 7, 41),

-- Charlie - Java Basics
(5, 1, 1),
(5, 2, 6),
(5, 3, 10),
(5, 4, 14),

-- David - SQL
(6, 8, 17),
(6, 9, 22),
(6, 10, 25),
(6, 11, 30);