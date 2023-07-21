const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {blogValidation} = require('../../validations');
const {blogController} = require('../../controllers/index')

const router = express.Router();

router
  .route('/')
  .post(auth(),validate(blogValidation.createBlog), blogController.createBlog)
  .get(auth(),blogController.blogGetAll)
 

  router.route('/:id')
  .patch(auth(),validate(blogValidation.updateBlog), blogController.updateblog)
  .delete(auth(),validate(blogValidation.deleteBlog), blogController.deleteBlog)
  .get(auth(),validate(blogValidation.getBlog), blogController.blogget)

module.exports = router;