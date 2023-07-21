const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {addressValidation} = require('../../validations');
const addressController = require('../../controllers/address.controller')

const router = express.Router();

router
  .route('/create')
  .post(auth(),validate(addressValidation.createAddress), addressController.createAddress)
 

  router.route('/update/:userId')
  .patch(auth(),validate(addressValidation.updatedaddress), addressController.udpateAddress)

module.exports = router;

