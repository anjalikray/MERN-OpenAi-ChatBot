import { Router } from "express";
import { getAllUsers, userSignup } from "../controllers/user-controllers.js";
import { signupValidator, validate } from "../utils/validators.js";

const userRouter = Router()

userRouter.get("/" , getAllUsers)
userRouter.post("/signup" , validate(signupValidator) , userSignup)

export default userRouter;