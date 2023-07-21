const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const blogService = require('../services/blog.service');
const blogModel = require('../models/blog.model');

const createBlog = catchAsync(async (req, res) => {
    const blog = await blogService.createBlog(req.body);
    res.status(httpStatus.CREATED).send(blog);
  });

  const updateblog = catchAsync(
    async(req,res) => {
      const { id } = req.params;
        const updatedBlog = await blogService.updateblog(id,req.body);
        res.send(updatedBlog);
    } 
  )

  const deleteBlog = catchAsync(
    async(req,res) => {
        const { id } = req.params;
          const deleteBlog = await blogService.deleteblog(id);
          res.send(deleteBlog);
      } 
  )

  const blogGetAll = catchAsync(
    async(req,res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search;
        let searchCondition = {};
        if(searchQuery){
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if(!dateRegex.test(searchQuery)){
                throw new ApiError(httpStatus.NOT_FOUND,"pleasee enter the date in this format : yyyy-mm-dd");
            }
            const date = new Date(searchQuery);
            const regexPattern = new RegExp(searchQuery,"i");
                searchCondition = {
                    $or : [
                        {title : regexPattern},
                        {description : regexPattern},
                        {
                            createdAt: {
                                $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                                $lte: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                            }
                        }
                    ]
                     
                }
        }
          const data = await blogService.blogGetAll(searchCondition,skip,limit);
          const totalData = await blogModel.find().countDocuments();
          const totalPage = Math.ceil(totalData / limit);
          res.send({
            data : data,
            page : page,
            totalPage : totalPage,
            dataPerPage : data?.length,
          });
      } 
  )

  const blogget = catchAsync(
    async(req,res) => {
        const { id } = req.params;
          const data = await blogService.blogget(id);
          res.send(data);
      } 
  )

  
module.exports = {
    createBlog,
    updateblog,
    deleteBlog,
    blogGetAll,
    blogget
}