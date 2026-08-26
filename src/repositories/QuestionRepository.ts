import { pool } from "../config/db";
import {
    Question,
    Choice,
    CreateQuestion,
    UpdateQuestion,
} from "../models/Question";

const mapQuestionRow = (row: any): Question => ({
    id: row.id,
    exam_id: row.exam_id ?? row.examId,
    statement: row.statement,
    points: row.points,
    position: row.position,
    created_at: row.created_at ?? row.createdAt,
});

const mapChoiceRow = (row: any): Choice => ({
    id: row.id,
    question_id: row.question_id ?? row.questionId,
    text: row.text ?? row.choice_text ?? row.choiceText,
    is_correct: row.is_correct ?? row.isCorrect,
});

const examExists = async (examId: number): Promise<boolean> => {
    const result = await pool.query(
        `SELECT id FROM exams WHERE id = $1;`,
        [examId]
    );
    return (result.rowCount ?? 0) > 0;
};

const examHasAttempts = async (examId: number): Promise<boolean> => {
    const result = await pool.query(
        `SELECT 1 FROM attempts WHERE exam_id = $1 LIMIT 1;`,
        [examId]
    );
    return (result.rowCount ?? 0) > 0;
};

const findByExamId = async (examId: number): Promise<Question[]> => {
    const result = await pool.query(
        `
        SELECT id, exam_id, statement, points, position, created_at
        FROM questions
        WHERE exam_id = $1
        ORDER BY position ASC, id ASC;
        `,
        [examId]
    );
    return result.rows.map(mapQuestionRow);
};

const findChoicesByExamId = async (examId: number): Promise<Choice[]> => {
    const result = await pool.query(
        `
        SELECT c.id, c.question_id, c.choice_text AS text, c.is_correct
        FROM choices c
        JOIN questions q ON q.id = c.question_id
        WHERE q.exam_id = $1
        ORDER BY c.id ASC;
        `,
        [examId]
    );
    return result.rows.map(mapChoiceRow);
};

const findById = async (id: number): Promise<Question | null> => {
    const result = await pool.query(
        `
        SELECT id, exam_id, statement, points, position, created_at
        FROM questions
        WHERE id = $1;
        `,
        [id]
    );
    const row = result.rows[0];
    return row ? mapQuestionRow(row) : null;
};

const findChoicesByQuestionId = async (questionId: number): Promise<Choice[]> => {
    const result = await pool.query(
        `
        SELECT id, question_id, choice_text AS text, is_correct
        FROM choices
        WHERE question_id = $1
        ORDER BY id ASC;
        `,
        [questionId]
    );
    return result.rows.map(mapChoiceRow);
};

const create = async (
    examId: number,
    data: CreateQuestion
): Promise<{ question: Question; choices: Choice[] }> => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const questionResult = await client.query(
            `
            INSERT INTO questions (exam_id, statement, points, position)
            VALUES ($1, $2, $3, $4)
            RETURNING id, exam_id, statement, points, position, created_at;
            `,
            [examId, data.statement, data.points, data.position]
        );
        const question = mapQuestionRow(questionResult.rows[0]);

        const choices: Choice[] = [];
        for (const c of data.choices) {
            const choiceResult = await client.query(
                `
                INSERT INTO choices (question_id, choice_text, is_correct)
                VALUES ($1, $2, $3)
                RETURNING id, question_id, choice_text AS text, is_correct;
                `,
                [question.id, c.text, c.is_correct]
            );
            choices.push(mapChoiceRow(choiceResult.rows[0]));
        }

        await client.query("COMMIT");
        return { question, choices };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

const update = async (
    id: number,
    data: UpdateQuestion
): Promise<{ question: Question; choices: Choice[] } | null> => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const questionResult = await client.query(
            `
            UPDATE questions
            SET statement = $1, points = $2, position = $3
            WHERE id = $4
            RETURNING id, exam_id, statement, points, position, created_at;
            `,
            [data.statement, data.points, data.position, id]
        );

        const row = questionResult.rows[0];
        if (!row) {
            await client.query("ROLLBACK");
            return null;
        }
        const question = mapQuestionRow(row);

        await client.query(`DELETE FROM choices WHERE question_id = $1;`, [id]);

        const choices: Choice[] = [];
        for (const c of data.choices) {
            const choiceResult = await client.query(
                `
                INSERT INTO choices (question_id, choice_text, is_correct)
                VALUES ($1, $2, $3)
                RETURNING id, question_id, choice_text AS text, is_correct;
                `,
                [id, c.text, c.is_correct]
            );
            choices.push(mapChoiceRow(choiceResult.rows[0]));
        }

        await client.query("COMMIT");
        return { question, choices };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

const remove = async (id: number): Promise<boolean> => {
    const result = await pool.query(
        `DELETE FROM questions WHERE id = $1;`,
        [id]
    );
    return (result.rowCount ?? 0) > 0;
};

export const QuestionRepository = {
    examExists,
    examHasAttempts,
    findByExamId,
    findChoicesByExamId,
    findById,
    findChoicesByQuestionId,
    create,
    update,
    remove,
};