const Joi = require('joi');
const { add } = require('../config/logger');
const { password, objectId } = require('./custom.validation');


const createBlog = {
    body : Joi.object().keys({
        title : Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        created_by: Joi.string().required().custom(objectId),
    })
};

const updateBlog = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId),
      }),
      body : Joi.object().keys({
        title : Joi.string(),
        description: Joi.string(),
        image: Joi.string(),
    }).min(1)
}

const deleteBlog = {
  params: Joi.object().keys({
      id : Joi.string().custom(objectId),
    }),
}

const getBlog = {
  params: Joi.object().keys({
      id : Joi.string().custom(objectId),
    }),
}



module.exports = {createBlog,updateBlog,deleteBlog,getBlog};