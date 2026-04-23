import { Router } from "express";
import { getBudgets, postBudget } from "../controllers/budget-controller";
import { asyncHandler } from "../utils/async-handler";

export const budgetRouter = Router();

budgetRouter.get("/", asyncHandler(getBudgets));
budgetRouter.post("/", asyncHandler(postBudget));
