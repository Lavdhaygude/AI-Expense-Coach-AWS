import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { env } from "./config/env";
import { requireAuth } from "./middleware/auth-middleware";
import { aiRouter } from "./routes/ai-routes";
import { authRouter } from "./routes/auth-routes";
import { budgetRouter } from "./routes/budget-routes";
import { expenseRouter } from "./routes/expense-routes";
import { importRouter } from "./routes/import-routes";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/expenses", requireAuth, expenseRouter);
app.use("/budgets", requireAuth, budgetRouter);
app.use("/imports", requireAuth, importRouter);
app.use("/ai", requireAuth, aiRouter);

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof Error) {
    return response.status(400).json({ message: error.message });
  }

  return response.status(500).json({ message: "Unexpected error" });
});

