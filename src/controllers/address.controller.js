const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const address_service = require('../services/address.service')



const createAddress = catchAsync(async (req, res) => {
    const user = await address_service.createAddress(req.body);
    res.status(httpStatus.CREATED).send(user);
  });

  const udpateAddress = catchAsync(
    async(req,res) => {
      const { user_id } = req.params;
      const {username} = req.query
        const updatedaddress = await address_service.updatedaddress(user_id,username,req.body);
        res.send(updatedaddress);
    } 
  )

  module.exports = {
    createAddress,
    udpateAddress
  };