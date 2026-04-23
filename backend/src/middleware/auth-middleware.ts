import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = request.cookies?.token;

  if (!token) {
    return response.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload === "string") {
      return response.status(401).json({ message: "Invalid session" });
    }

    const claims = payload as JwtPayload & {
      sub?: string | number;
      email?: string;
      role?: "admin" | "user";
    };

    if (!claims.sub || !claims.email || !claims.role) {
      return response.status(401).json({ message: "Invalid session" });
    }

    request.user = {
      id: Number(claims.sub),
      email: claims.email,
      role: claims.role
    };

    return next();
  } catch {
    return response.status(401).json({ message: "Invalid session" });
  }
}
