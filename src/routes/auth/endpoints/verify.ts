import { Users } from "!/src/database/models/users";
import Logger from "!/src/utils/logger";
import { Request, Response } from "express";
import { Op } from "sequelize";

export const verify = async (req: Request, res: Response) => {
    try{
        const { authToken } = req.cookies;
        if(!authToken) return res.status(400).json({ message: "No token provided." });

        console.log(authToken);

        return res.status(200).json({ message: "Hello World!" });

    }catch(error:unknown){
        res.status(500).json({ message: "Internal Server Error " });
        Logger.error(error);
    }
};
