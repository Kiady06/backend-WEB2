INSERT INTO users (email, password, role, is_active)
VALUES ('admin@exam.com', '$2b$10$ZtpmKueP0x1PT.W.H8rW8.Nwl79sGqayiICLcvDAGlJrrvpnZxLZe', 'admin', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password, role, is_active)
VALUES ('student@exam.com', '$2b$10$FhVvfQ11pLTo4RRtVg9kPux23Rk.jeX6OhJ9e8FlQ37fsQ1js0ErG', 'student', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO courses (name, description)
VALUES ('WEB2', 'Web development course - Semester 2')
ON CONFLICT DO NOTHING;
