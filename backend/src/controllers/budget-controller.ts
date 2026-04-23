import { Request, Response } from "express";
import { z } from "zod";
import { listBudgets, upsertBudget } from "../services/budget-service";

const budgetSchema = z.object({
  category: z.string().min(1),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.coerce.number().positive()
});

export async function getBudgets(request: Request, response: Response) {
  const items = await listBudgets(request.user!.id);
  return response.json({ items });
}

export async function postBudget(request: Request, response: Response) {
  const payload = budgetSchema.parse(request.body);
  const item = await upsertBudget(
    request.user!.id,
    payload.category,
    payload.month,
    payload.amount
  );
  return response.status(201).json({ item });
}

