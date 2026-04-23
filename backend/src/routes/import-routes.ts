import { Router } from "express";
import { importExpensesCsv } from "../controllers/import-controller";
import { asyncHandler } from "../utils/async-handler";

export const importRouter = Router();

importRouter.post("/csv", asyncHandler(importExpensesCsv));
