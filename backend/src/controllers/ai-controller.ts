import { Request, Response } from "express";
import { z } from "zod";
import { getMonthlyMetrics } from "../services/analytics-service";
import { generateMonthlySummary, getAiStatus, suggestCategory } from "../services/ai-service";
import { classifyExpense } from "../utils/categories";

const categorizeSchema = z.object({
  merchant: z.string().min(1),
  description: z.string().optional()
});

export async function categorizeExpense(request: Request, response: Response) {
  const payload = categorizeSchema.parse(request.body);
  const ruleBased = classifyExpense(payload.merchant, payload.description);

  if (ruleBased.confidence === "rule") {
    return response.json({ category: ruleBased.category, source: "rule" });
  }

  const suggestion = await suggestCategory(payload.merchant, payload.description);
  return response.json(suggestion);
}

export async function getMonthlySummary(request: Request, response: Response) {
  const month = z.string().regex(/^\d{4}-\d{2}$/).parse(
    request.query.month ?? new Date().toISOString().slice(0, 7)
  );
  const metrics = await getMonthlyMetrics(request.user!.id, month);
  const insight = await generateMonthlySummary(metrics);
  return response.json({ month, ...getAiStatus(), metrics, insight });
}

export function getAiProviderStatus(_request: Request, response: Response) {
  return response.json(getAiStatus());
}
