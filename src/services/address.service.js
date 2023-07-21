const httpStatus = require('http-status');
const addressModel = require('../models/address.model');
const ApiError = require('../utils/ApiError');
const Redis = require('ioredis');
const client = new Redis();

const createAddress = async (addressBody) => {
  return await addressModel.create(addressBody);
};

const updatedaddress = async (id, username, body) => {
  const updatedaddress = addressModel.findOneAndUpdate(
    { user_id: new mongoose.Types.ObjectId(id) },
    {
      $set: body,
    },
    { new: true }
  );

  const redisUser = await client.hgetall(username);
  const address = updatedaddress?.address;
  for (let key in address) {
    if (redisUser.hasOwnProperty(key) && redisUser[key] !== address[key]) {
      redisUser[key] = address[key];
    }
  }
  await client.hset(username, redisUser);
  return res.status(200).send(updatedaddress);
};

module.exports = {
  createAddress,
  updatedaddress,
};
