import { Request, Response } from "express";
import { z } from "zod";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense
} from "../services/expense-service";

const expenseSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: z.string().default("USD"),
  transactionDate: z.string().min(10),
  merchant: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional()
});

export async function getExpenses(request: Request, response: Response) {
  const items = await listExpenses(request.user!.id);
  return response.json({ items });
}

export async function postExpense(request: Request, response: Response) {
  const payload = expenseSchema.parse(request.body);
  const item = await createExpense({
    ...payload,
    userId: request.user!.id,
    source: "manual"
  });
  return response.status(201).json({ item });
}

export async function putExpense(request: Request, response: Response) {
  const payload = expenseSchema.parse(request.body);
  const expenseId = Number(request.params.id);
  const item = await updateExpense(request.user!.id, expenseId, payload);
  if (!item) {
    return response.status(404).json({ message: "Expense not found" });
  }
  return response.json({ item });
}

export async function removeExpense(request: Request, response: Response) {
  const deleted = await deleteExpense(request.user!.id, Number(request.params.id));
  if (!deleted) {
    return response.status(404).json({ message: "Expense not found" });
  }
  return response.status(204).send();
}

