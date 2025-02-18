import { Users } from "!/src/database/models/users";
import Logger from "!/src/utils/logger";
import { Request, Response } from "express";
import { Op } from "sequelize";

export const login = async (req: Request, res: Response) => {
    try{
        const { email, username, password } = req.body;
    
        const user = await Users.findOne({ where: { [Op.or]: {
            email: email,
            username: username
        } } });

        if(!user) return res.status(400).json({ message: "User not found." });
        if(!user.comparePassword(password)) return res.status(400).json({ message: "Invalid password." });

        res.cookie("authToken", user.generateToken(), { httpOnly: true, secure: false, sameSite: "strict" });
        return res.status(200).json({ success: true });

    }catch(error:unknown){
        res.status(500).json({ success: false, message: "Internal Server Error " });
        Logger.error(error);
    }
};
