import { Request, Response, NextFunction } from "express";
import xss from "xss";

const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    if (schema) {
        const sanitizedQuery = sanitizeObject(req.query);
        const sanitizedBody = sanitizeObject(req.body);
        const sanitizedParams = sanitizeObject(req.params);
        const result = schema.validate({ ...sanitizedQuery, ...sanitizedBody, ...sanitizedParams });

        if (result.error) {
            const { details } = result.error;
            const message = details[0].message.replace(/"|'/g, "");
            return res.status(400).json({ message });
        }
    }

    next();
};

function sanitizeObject(obj: any) {
    const sanitizedObj: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            sanitizedObj[key] = xss(obj[key]);
        }
    }
    return sanitizedObj;
}

export default validate;
