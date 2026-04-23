import { Request, Response } from "express";
import { z } from "zod";
import { importCsv } from "../services/import-service";

const importSchema = z.object({
  filename: z.string().min(1),
  csv: z.string().min(1)
});

export async function importExpensesCsv(request: Request, response: Response) {
  const payload = importSchema.parse(request.body);
  const item = await importCsv(request.user!.id, payload.filename, payload.csv);
  return response.status(201).json({ item });
}

