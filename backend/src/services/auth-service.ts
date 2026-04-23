import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { pool } from "../db/pool";

type UserRecord = {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: "admin" | "user";
};

export async function createUser(fullName: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query<UserRecord>(
    `
      INSERT INTO users (full_name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, full_name, email, password_hash, role
    `,
    [fullName, email, passwordHash]
  );

  return result.rows[0];
}

export async function authenticateUser(email: string, password: string) {
  const result = await pool.query<UserRecord>(
    `SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  return isValid ? user : null;
}

export function signToken(user: { id: number; email: string; role: string }) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

