const Joi = require("@hapi/joi");

const registerValidation = data => {
    
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        phoneNumber: Joi.string().min(10).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data)
};

const loginValidation = data => {

    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data)
};
const tempLoginValidation = data =>
{
    const schema = Joi.object(
        {
            phoneNumber: Joi.string().min(6).required(),
            password: Joi.string().min(6).max(6).required()
        }
    )
    return schema.validate(data)
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.tempLoginValidation = tempLoginValidation;