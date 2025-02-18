import { Users } from "!/src/database/models/users";
import Logger from "!/src/utils/logger";
import { Request, Response } from "express";
import { Op } from "sequelize";

export const register = async (req: Request, res: Response) => {
    try{
        const { email, username, password } = req.body;

        const doesExist = await Users.findOne({ where: { [Op.or]: {
            email: email,
            username: username
        } } });

        if(doesExist) return res.status(400).json({ message: "User already exists." });

        const hashedPassword = Users.hashPassword(password);
        const user = await Users.create({ email, username, password: hashedPassword });
        
        if(!user) return res.status(500).json({ message: "Failed to register user." });

        res.cookie("authToken", user.generateToken(), { httpOnly: true, secure: false, sameSite: "strict" });
        return res.status(200).json({ success: true, message: "Register Successful!" });
    }catch(error:unknown){
        res.status(500).json({ success: false, message: "Internal Server Error " });
        Logger.error(error);
    }
}