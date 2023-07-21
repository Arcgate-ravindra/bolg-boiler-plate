const Joi = require('joi');
const { add } = require('../config/logger');
const { password, objectId } = require('./custom.validation');

const createAddress = {
    body : Joi.object().keys({
      user_id : Joi.string().required(),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
    })
};

const updatedaddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body : Joi.object().keys({
    user_id : Joi.string(),
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
  }).min(1)
}


module.exports = {createAddress,updatedaddress};