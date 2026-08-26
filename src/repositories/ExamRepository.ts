import {pool} from "../config/db";
import type { Exam } from "../models/Exam";

export const ExamRepository={
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