import { pool } from "../config/db";
import {Course, CreateCourse, UpdateCourse } from "../models/Course";

export const findAll = async (): Promise<Course[]> => {
    const result = await pool.query<Course>(`
        SELECT
            c.id,
            c.code,
            c.name,
            c.description,
            c.created_at,
            COUNT(e.id)::int AS exam_count
        FROM courses c
        LEFT JOIN exams e ON e.course_id = c.id
        GROUP BY c.id
        ORDER BY c.id;
    `);

    return result.rows;
};

export const findById = async (
    id: number
): Promise<Course | null> => {
    const result = await pool.query<Course>(
        `
        SELECT
            c.id,
            c.code,
            c.name,
            c.description,
            c.created_at,
            COUNT(e.id)::int AS exam_count
        FROM courses c
        LEFT JOIN exams e ON e.course_id = c.id
        WHERE c.id = $1
        GROUP BY c.id;
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

export const findByCode = async (
    code: string
): Promise<Course | null> => {
    const result = await pool.query<Course>(
        `
        SELECT
            id,
            code,
            name,
            description,
            created_at
        FROM courses
        WHERE LOWER(code) = LOWER($1);
        `,
        [code]
    );

    return result.rows[0] ?? null;
};

const findByCodeExcludingId = async (
    code: string,
    excludeId: number
): Promise<Course | null> => {
    const result = await pool.query<Course>(
        `
        SELECT
            id,
            code,
            name,
            description,
            created_at
        FROM courses
        WHERE LOWER(code) = LOWER($1) AND id != $2;
        `,
        [code, excludeId]
    );

    return result.rows[0] ?? null;
};

const create = async (
    data: CreateCourse
): Promise<Course> => {
    const result = await pool.query<Course>(
        `
        INSERT INTO courses (
            code,
            name,
            description
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            code,
            name,
            description,
            created_at;
        `,
        [
            data.code,
            data.name,
            data.description ?? null
        ]
    );

    const row = result.rows[0];
    if (!row) {
    throw new Error("Insert did not return the created student");
  }
  return row;
};

const update = async (
    id: number,
    data: UpdateCourse
): Promise<Course | null> => {
    const result = await pool.query<Course>(
        `
        UPDATE courses
        SET
            code = $1,
            name = $2,
            description = $3
        WHERE id = $4
        RETURNING
            id,
            code,
            name,
            description,
            created_at;
        `,
        [
            data.code,
            data.name,
            data.description ?? null,
            id
        ]
    );

    return result.rows[0] ?? null;
};

const remove = async (
    id: number
): Promise<boolean> => {
    const result = await pool.query(
        `
        DELETE FROM courses
        WHERE id = $1;
        `,
        [id]
    );

    return (result.rowCount ?? 0) > 0;
};

const hasExams = async (
    id: number
): Promise<boolean> => {
    const result = await pool.query<{ count: number }>(
        `
        SELECT COUNT(*)::int AS count
        FROM exams
        WHERE course_id = $1;
        `,
        [id]
    );

    return (result.rows[0]?.count ?? 0) > 0;
};

export const CourseRepository = {
    findAll,
    findById,
    findByCode,
    findByCodeExcludingId,
    create,
    update,
    remove,
    hasExams,
};