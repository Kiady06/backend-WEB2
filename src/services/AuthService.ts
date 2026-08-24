import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { signToken } from "../security/jwt";

export class InvalidCredentialsError extends Error {}
export class AccountDisabledError extends Error {}

interface LoginResult {
  token: string;
  user: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
}

const login = async (email: string, password: string): Promise<LoginResult> => {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new InvalidCredentialsError("Invalid email or password");
  }

  if (!user.isActive) {
    throw new AccountDisabledError("This account has been disabled");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new InvalidCredentialsError("Invalid email or password");
  }

  const token = signToken({ id: user.id, isAdmin: user.isAdmin });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  };
};

export const AuthService = {
  login,
};