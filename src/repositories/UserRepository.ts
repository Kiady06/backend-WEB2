import { pool } from "../config/db";
import { User, UserRow, UpdateStudentFields } from "../models/User";

const mapRowToUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.password,
  isAdmin: row.is_admin,
  isActive: row.is_active,
  createdAt: row.created_at,
});

const findByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query<UserRow>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
};

const findByEmailExcludingId = async (email: string, excludeId: number): Promise<User | null> => {
  const result = await pool.query<UserRow>(
    "SELECT * FROM users WHERE email = $1 AND id != $2",
    [email, excludeId]
  );
  return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
};

const findById = async (id: number): Promise<User | null> => {
  const result = await pool.query<UserRow>(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
};

const findAllStudents = async (): Promise<User[]> => {
  const result = await pool.query<UserRow>(
    "SELECT * FROM users WHERE is_admin = false ORDER BY name"
  );
  return result.rows.map(mapRowToUser);
};

const createStudent = async (name: string, email: string, passwordHash: string): Promise<User> => {
  const result = await pool.query<UserRow>(
    `INSERT INTO users (name, email, password, is_admin, is_active)
     VALUES ($1, $2, $3, FALSE, TRUE)
     RETURNING *`,
    [name, email, passwordHash]
  );
  const row = result.rows[0];
  if (!row) {
    throw new Error("Insert did not return the created student");
  }
  return mapRowToUser(row);
};

const updateStudent = async (id: number, fields: UpdateStudentFields): Promise<User | null> => {
  const result = await pool.query<UserRow>(
    `UPDATE users
     SET name = COALESCE($1, is_active),
         email = COALESCE($2, email),
         is_active = COALESCE($3, is_active),
         password = COALESCE($4, password)
     WHERE id = $5 AND is_admin = false
     RETURNING *`,
    [fields.name, fields.email, fields.isActive ?? null, fields.passwordHash ?? null, id]
  );
  return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
};

const disableStudent = async (id: number): Promise<User | null> => {
  const result = await pool.query<UserRow>(
    `UPDATE users SET is_active = FALSE WHERE id = $1 AND is_admin = false RETURNING *`,
    [id]
  );
  return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
};

export const UserRepository = {
  findByEmail,
  findByEmailExcludingId,
  findById,
  findAllStudents,
  createStudent,
  updateStudent,
  disableStudent,
};