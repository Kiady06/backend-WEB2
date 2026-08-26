import { pool } from "../config/db";
import type { User, UserRow } from "../models/User";

const mapRowToUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  name:row.name,
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

const findById = async (id: number): Promise<User | null> => {
  const result = await pool.query<UserRow>(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
};

const findAllStudents = async ():Promise<User[]> => {
  const result = await pool.query<UserRow>(
    "SELECT * FROM users WHERE is_admin = false"
  );

  return result.rows ? result.rows.map(mapRowToUser);
}

export const UserRepository = {
  findByEmail,
  findById,
  findAllStudents
};