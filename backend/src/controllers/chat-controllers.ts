import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import { openai } from "../config/openai-config.js";


export const generateChatCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { message } = req.body;

    try {
        const user = await User.findById(res.locals.jwtData.id);

        if (!user) {
            return res.status(401).json({
                message: "User not registered or Token Malfunctioned",
            });
        }

        // Filter out any null or undefined chats
        const validChats = user.chats.filter(chat => chat !== null && chat !== undefined);

        // Grab chats of user
        const chats = validChats.map(({ role, content }) => ({
            role: role as 'user' | 'assistant' | 'system', // Ensure the role is one of the expected values
            content: content as string, // Ensure the content is a string
        }));

        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });


        //get latest response
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: chats,
            stream: true,
        });
        let fullResponse = "";

        for await (const chunk of chatResponse) {
            const content = chunk.choices[0]?.delta?.content || "";
            process.stdout.write(content);
            fullResponse += content;
        }

        user.chats.push({ content: fullResponse, role: "assistant" });
        await user.save();

        return res.status(200).json({ chats: user.chats });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went horribaly wrong" });
    }
};

export const sendChatsToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .send("User not registered or Token Malfunctioned");
        }

        // console.log(user._id.toString() , res.locals.jwtData.id)

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didn't match");
        }

        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const deleteChats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .send("User not registered or Token Malfunctioned");
        }

        // console.log(user._id.toString() , res.locals.jwtData.id)

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didn't match");
        }

        //@ts-ignore
        user.chats = [];
        await user.save();

        return res.status(200).json({ message: "OK" });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
