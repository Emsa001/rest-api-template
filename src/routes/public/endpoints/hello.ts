import logger from "@/utils/logger";
import { Request, Response } from "express";

const hello_params = (req: Request, res: Response) => {
    try {
        const user = req.params.user;

        return res.json({ message: `Hello in /public ${user}` });
    } catch (error) {
        logger.error({
            message: "Error handling hello_params",
            object: error,
        });

        return res.status(500).json({ error: "An error occurred while processing your request." });
    }
};

const hello_query = (req: Request, res: Response) => {
    try {
        const user = req.query.user;

        return res.json({ message: `Hello in /public ${user}` });
    } catch (error) {
        logger.error({
            message: "Error handling hello_query",
            object: error,
        });

        return res.status(500).json({ error: "An error occurred while processing your request." });
    }
};

export { hello_params, hello_query };
