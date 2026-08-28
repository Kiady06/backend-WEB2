import { pool } from "../config/db";
import { Attempt, Answer } from "../models/attempt";

export const attemptRepository = {
  async findByStudentAndExam(
    studentId: number,
    examId: number
  ): Promise<Attempt | null> {
    const result = await pool.query(
      "SELECT * FROM attempts WHERE student_id = $1 AND exam_id = $2",
      [studentId, examId]
    );
    return result.rows[0] || null;
  },

  async createAttempt(
    studentId: number,
    examId: number,
    score: number,
    totalPoints: number
  ): Promise<Attempt> {
    const result = await pool.query(
      `INSERT INTO attempts (student_id, exam_id, score, total_points)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [studentId, examId, score, totalPoints]
    );
    return result.rows[0];
  },

  async saveAnswer(
    attemptId: number,
    questionId: number,
    choiceId: number | null
  ): Promise<Answer> {
    const result = await pool.query(
      `INSERT INTO answers (attempt_id, question_id, choice_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [attemptId, questionId, choiceId]
    );
    return result.rows[0];
  },

  async findAnswersByAttemptId(attemptId: number): Promise<Answer[]> {
    const result = await pool.query(
      "SELECT * FROM answers WHERE attempt_id = $1",
      [attemptId]
    );
    return result.rows;
  },

  async findAllByStudent(studentId: number): Promise<Attempt[]> {
    const result = await pool.query(
      `SELECT a.*, e.name AS exam_name, c.name AS course_name
       FROM attempts a
       JOIN exams e ON e.id = a.exam_id
       JOIN courses c ON c.id = e.course_id
       WHERE a.student_id = $1
       ORDER BY a.submitted_at DESC`,
      [studentId]
    );
    return result.rows;
  },

  async findAllByExam(examId: number): Promise<Attempt[]> {
    const result = await pool.query(
      `SELECT a.*, u.email AS student_email
       FROM attempts a
       JOIN users u ON u.id = a.student_id
       WHERE a.exam_id = $1
       ORDER BY a.submitted_at ASC`,
      [examId]
    );
    return result.rows;
  },
};