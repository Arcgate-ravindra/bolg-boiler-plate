const httpStatus = require('http-status');
const blogModel = require('../models/blog.model');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const createBlog = async (blogBody) => {
  return await blogModel.create(blogBody);
};

const updateblog = async (id, body) => {
  return await blogModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    { $set: { ...body, updatedAt: new Date() } },
    { new: true }
  );
};

const deleteblog = async (id) => {
  return await blogModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};

const blogGetAll = async (searchCondition, skip, limit) => {
  return await blogModel.aggregate([
    {
      $match: searchCondition,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'created_by',
        foreignField: '_id',
        as: 'blog-details',
      },
    },
    {
      $unwind: '$blog-details',
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        title: 1,
        description: 1,
        image: 1,
        created_by: "$blog-details.username",
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
}

const blogget = async(id) => {
    return await blogModel.aggregate([
        {
            $match : {_id : new mongoose.Types.ObjectId(id)}
        },
        {
            $lookup : {
                from : "users",
                localField :  "created_by",
                foreignField : "_id",
                as : "blog-details"
            }
        },
        {
            $unwind : "$blog-details"
        },
        {
            $project : {
                title : 1,
                description : 1,
                image : 1,
                created_by : {  $concat: ["$blog-details.first_name", " ", "$blog-details.last_name"]},
                createdAt : 1,
                updatedAt : 1, 
            }
        }
    ])  
}

module.exports = { createBlog, updateblog, deleteblog, blogGetAll,blogget };
