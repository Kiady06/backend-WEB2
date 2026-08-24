export interface User {
  id: number;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface UserRow {
  id: number;
  email: string;
  password: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: Date;
}