import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

const validate = (schema:any) => (req:Request, res:Response, next:NextFunction) => {
    if (schema) {
        const sanitizedData = req.method === 'GET' ? sanitizeObject(req.query) : sanitizeObject(req.body);
        const result = schema.validate(sanitizedData);
        if (result.error) {
            const { details } = result.error;
            const message = details[0].message.replace(/"|'/g, '');
            return res.status(400).json({ message });
        }
    }

    next();
};

function sanitizeObject(obj:any) {
    const sanitizedObj: {[key: string]: any} = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            sanitizedObj[key] = xss(obj[key]);
        }
    }
    return sanitizedObj;
}

export default validate;