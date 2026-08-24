import jwt from "jsonwebtoken";

export class TokenExpiredError extends Error {}
export class TokenInvalidError extends Error {}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing environment variable: JWT_SECRET");
}

const EXPIRES_IN = "8h";

export interface JwtPayload {
  id: number;
  isAdmin: boolean;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new TokenExpiredError("Token has expired");
    }
    throw new TokenInvalidError("Invalid token");
  }
};