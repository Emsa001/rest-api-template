import logger from "@/utils/logger";
import { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
    try {
        return res.json({ message: "Hello World" });
    } catch (error) {
        logger.error({
            message: "Error handling helloWorld",
            object: error,
        });
    }
};

export default register;