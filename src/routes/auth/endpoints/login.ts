import Logger from "!/src/utils/logger";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
    try{
        const { email, username, password } = req.body;

        console.log(email, username, password);

        res.cookie("token", "123456", { httpOnly: true });
        return res.status(200).json({ message: "Login Successful!" });
    }catch(error:unknown){
        res.status(500).json({ message: "Internal Server Error " });
        Logger.error(error);
    }
};