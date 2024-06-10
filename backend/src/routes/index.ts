import {Router} from "express"
import userRouter from "./user-route.js";
import chatRouter from "./chat-route.js";

const appRouter = Router();

appRouter.use("/user" , userRouter )   //domain/api/v1/user
appRouter.use("/chats" , chatRouter )  //domain/api/v1/chats 

export default appRouter;