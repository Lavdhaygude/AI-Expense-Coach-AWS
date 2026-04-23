import { Request, Response } from "express";
import { DatabaseError } from "pg";
import { z } from "zod";
import { authenticateUser, createUser, signToken } from "../services/auth-service";

const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function signup(request: Request, response: Response) {
  const payload = signupSchema.parse(request.body);
  try {
    const user = await createUser(payload.fullName, payload.email, payload.password);
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    response.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    return response.status(201).json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof DatabaseError && error.code === "23505") {
      return response.status(409).json({ message: "An account with this email already exists" });
    }

    throw error;
  }
}

export async function login(request: Request, response: Response) {
  const payload = loginSchema.parse(request.body);
  const user = await authenticateUser(payload.email, payload.password);

  if (!user) {
    return response.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  response.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  return response.json({
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role
    }
  });
}

export function logout(_request: Request, response: Response) {
  response.clearCookie("token");
  return response.status(204).send();
}
