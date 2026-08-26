import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { User, StudentDTO } from "../models/User";
import { NotFoundError, ConflictError } from "./errors/CommonErrors";

const SALT_ROUNDS = 10;

const toStudentDTO = (user: User): StudentDTO => ({
  id: user.id,
  name: user.name,
  email: user.email,
  is_active: user.isActive,
  created_at: user.createdAt,
});

const list = async (): Promise<StudentDTO[]> => {
  const students = await UserRepository.findAllStudents();
  return students.map(toStudentDTO);
};

const create = async (name: string, email: string, password: string): Promise<StudentDTO> => {
  const existing = await UserRepository.findByEmail(email);
  if (existing) {
    throw new ConflictError("Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const student = await UserRepository.createStudent(name, email, passwordHash);
  return toStudentDTO(student);
};

interface UpdateStudentInput {
  name: string;
  email: string;
  is_active?: boolean;
  password?: string;
}

const update = async (id: number, input: UpdateStudentInput): Promise<StudentDTO> => {
  const existingWithEmail = await UserRepository.findByEmailExcludingId(input.email, id);
  if (existingWithEmail) {
    throw new ConflictError("Email already in use");
  }

  const passwordHash = input.password ? await bcrypt.hash(input.password, SALT_ROUNDS) : undefined;

  const updated = await UserRepository.updateStudent(id, {
    name: input.name,
    email: input.email,
    isActive: input.is_active,
    passwordHash,
  });

  if (!updated) {
    throw new NotFoundError("Student not found");
  }

  return toStudentDTO(updated);
};

const disable = async (id: number): Promise<StudentDTO> => {
  const disabled = await UserRepository.disableStudent(id);
  if (!disabled) {
    throw new NotFoundError("Student not found");
  }
  return toStudentDTO(disabled);
};

export const StudentService = {
  list,
  create,
  update,
  disable,
};