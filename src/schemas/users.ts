import { verify } from "crypto";
import Joi from "joi";

const schemas = {
    register: Joi.object().keys({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),

    login: Joi.object()
        .keys({
            email: Joi.string().email(),
            username: Joi.string(),
            password: Joi.string().required(),
        })
        .or("email", "username")
        .required(),

    verify: Joi.object().keys({ }),
};

export default schemas;
