import { Router } from "express";
import {
  categorizeExpense,
  getAiProviderStatus,
  getMonthlySummary
} from "../controllers/ai-controller";
import { asyncHandler } from "../utils/async-handler";

export const aiRouter = Router();

aiRouter.get("/status", getAiProviderStatus);
aiRouter.post("/categorize", asyncHandler(categorizeExpense));
aiRouter.get("/monthly-summary", asyncHandler(getMonthlySummary));
