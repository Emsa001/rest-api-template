import logger from "@/utils/logger";
import { Request, Response } from "express";

const hello = (req: Request, res: Response)  => {
    try {
        return res.json({ message: `You see this because you're authorized` });
    } catch (error) {
        logger.error({
            message: "Error handling hello",
            object: error,
        });

        return res.status(500).json({ error: "An error occurred while processing your request." });
    }
};

export { hello };