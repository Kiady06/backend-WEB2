CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('admin', 'student')),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE courses (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE exams (
    id            SERIAL PRIMARY KEY,
    course_id     INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    name          VARCHAR(255) NOT NULL,
    start_date    TIMESTAMP NOT NULL,
    end_date      TIMESTAMP NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    CHECK (end_date > start_date)
);

CREATE TABLE questions (
    id            SERIAL PRIMARY KEY,
    exam_id       INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    statement     TEXT NOT NULL,
    points        INTEGER NOT NULL DEFAULT 1,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE choices (
    id            SERIAL PRIMARY KEY,
    question_id   INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    choice_text   TEXT NOT NULL,
    is_correct    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE attempts (
    id            SERIAL PRIMARY KEY,
    student_id    INTEGER NOT NULL REFERENCES users(id),
    exam_id       INTEGER NOT NULL REFERENCES exams(id),
    score         INTEGER NOT NULL DEFAULT 0,
    total_points  INTEGER NOT NULL DEFAULT 0,
    submitted_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, exam_id)
);

CREATE TABLE answers (
    id            SERIAL PRIMARY KEY,
    attempt_id    INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id   INTEGER NOT NULL REFERENCES questions(id),
    choice_id     INTEGER REFERENCES choices(id)
);

CREATE INDEX idx_exams_course_id ON exams(course_id);
CREATE INDEX idx_questions_exam_id ON questions(exam_id);
CREATE INDEX idx_choices_question_id ON choices(question_id);
CREATE INDEX idx_attempts_exam_id ON attempts(exam_id);
CREATE INDEX idx_answers_attempt_id ON answers(attempt_id);
