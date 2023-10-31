const Joi = require("joi");

module.exports = {
    test: Joi.object().keys({
        test: Joi.string().required(),
    }),
};
