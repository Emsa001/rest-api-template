import Joi from 'joi';

const schemas = {
    register: Joi.object().keys({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        password_repeat: Joi.ref("password"),
    }),

    login: Joi.object().keys({
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string().required(),
    }).or('email', 'username').required(),
};

export default schemas;