import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import { hash } from "bcrypt";

//get all users
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const userSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //user signup
        const { name, email, password } = req.body;
        const hashedPassword = await hash(password, 10);  //using bcypt to hash password here 10 means password will hashed in 10 rounds 
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        return res.status(201).json({ message: "OK", id:user._id.toString() });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
