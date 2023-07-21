const express = require('express');
const fileController = require('../../controllers/file.controller');
const router = express.Router();


router
.route('/')
.post(fileController.fileUplaod)


module.exports = router;



