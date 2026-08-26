import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { signToken } from "../security/jwt";
import { AppError } from "./errors/AppError";

export class InvalidCredentialsError extends AppError {
  constructor(message = "Invalid email or password") {
    super(message, 401);
  }
}

export class AccountDisabledError extends AppError {
  constructor(message = "This account has been disabled") {
    super(message, 403);
  }
}

interface LoginResult {
  token: string;
  user: {
    id: number;
    name: string,
    email: string;
    isAdmin: string;
  };
}

const toRole = (isAdmin:boolean) => {
  return isAdmin ? "admin" : "student";
}

const login = async (email: string, password: string): Promise<LoginResult> => {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  if (!user.isActive) {
    throw new AccountDisabledError();
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new InvalidCredentialsError();
  }

  const token = signToken({ id: user.id, isAdmin: user.isAdmin });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: toRole(user.isAdmin)
    },
  };
};

export const AuthService = {
  login,
};