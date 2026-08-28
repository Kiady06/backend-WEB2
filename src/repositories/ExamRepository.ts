import {pool} from "../config/db";
import type { Exam } from "../models/Exam";

export const ExamRepository={

    async findAll(): Promise<Exam[]> {
    const result = await pool.query(
      `SELECT e.*, c.name AS course_name
       FROM exams e
       JOIN courses c ON c.id = e.course_id
       ORDER BY e.id ASC`
    );
    return result.rows;
  },

   async create(
    courseId: number,
    name: string,
    description: string,
    startDate: string,
    endDate: string
  ): Promise<Exam> {
    const result = await pool.query(
      `INSERT INTO exams (course_id, name, description, start_date, end_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [courseId, name, startDate, endDate]
    );
    return result.rows[0];
  },

   async update(
    id: number,
    name: string,
    description: string,
    startDate: string,
    endDate: string
  ): Promise<Exam | null> {
    const result = await pool.query(
      `UPDATE exams SET name = $1, description = $2, start_date = $3, end_date = $4
       WHERE id = $5 RETURNING *`,
      [name, description,startDate, endDate, id]
    );
    return result.rows[0] || null;
  },


    async findById(id: number): Promise<Exam | null> {
    const result = await pool.query("SELECT * FROM exams WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  },

  async countAttemptsForExam(id: number): Promise<number> {
    const result = await pool.query(
      "SELECT COUNT(*)::int AS count FROM attempts WHERE exam_id = $1",
      [id]
    );
    return result.rows[0].count;
  },

  async remove(id: number): Promise<void> {
    await pool.query("DELETE FROM exams WHERE id = $1", [id]);
  },
  
    async findAvailableForStudent(studentId:number): Promise<Exam[]>{
        const result= await pool.query(
        `SELECT e.*, c.name AS course_name
        FROM exams e
        JOIN courses c ON c.id = e.course_id
        WHERE NOW() BETWEEN e.start_date AND e.end_date
        AND NOT EXISTS (
         SELECT 1 FROM attempts a
         WHERE a.exam_id = e.id AND a.student_id = $1
       )
       ORDER BY e.start_date ASC`,
      [studentId]
        );
        return result.rows;
    }
  
};
