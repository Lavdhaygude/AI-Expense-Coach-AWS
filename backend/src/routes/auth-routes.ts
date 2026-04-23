import { Router } from "express";
import { login, logout, signup } from "../controllers/auth-controller";
import { asyncHandler } from "../utils/async-handler";

export const authRouter = Router();

authRouter.post("/signup", asyncHandler(signup));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", logout);
