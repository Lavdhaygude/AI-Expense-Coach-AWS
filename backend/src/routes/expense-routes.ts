import { Router } from "express";
import {
  getExpenses,
  postExpense,
  putExpense,
  removeExpense
} from "../controllers/expense-controller";
import { asyncHandler } from "../utils/async-handler";

export const expenseRouter = Router();

expenseRouter.get("/", asyncHandler(getExpenses));
expenseRouter.post("/", asyncHandler(postExpense));
expenseRouter.put("/:id", asyncHandler(putExpense));
expenseRouter.delete("/:id", asyncHandler(removeExpense));
