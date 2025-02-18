import { Users } from "!/src/database/models/users";
import Logger from "!/src/utils/logger";
import { Request, Response } from "express";
import { Op } from "sequelize";

interface TokenData {
    id: number;
    iat: number;
    exp: number;
}

export const verify = async (req: Request, res: Response) => {
    try{
        const { authToken } = req.cookies;
        if(!authToken) return res.status(400).json({ message: "No token provided." });

        const decoded = Users.decodeToken(authToken);
        if(decoded === null) return res.status(400).json({ message: "Invalid token." });

        const { id, exp } = decoded as TokenData;
        const now = Date.now().valueOf() / 1000;

        if(exp - now < 0) return res.status(400).json({ message: "Token expired." });

        const user = await Users.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["password", "updatedAt"]
            }
        });

        return res.status(200).json(user);
    }catch(error:unknown){
        res.status(500).json({ message: "Internal Server Error " });
        Logger.error(error);
    }
};
