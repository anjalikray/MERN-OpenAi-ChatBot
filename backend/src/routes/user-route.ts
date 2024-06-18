import { Router } from "express";
import { getAllUsers, userSignup , userLogin, verifyUser } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRouter = Router()

userRouter.get("/" , getAllUsers)
userRouter.post("/signup" , validate(signupValidator) , userSignup)
userRouter.post("/login" , validate(loginValidator) , userLogin)
userRouter.get("/auth-status" , verifyToken , verifyUser)

export default userRouter;