const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const userModel = require('../models/user.model');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const skip = (page - 1) * limit;
  const searchQuery = req.query.search;
  let searchCondition = {};
  if (searchQuery) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(searchQuery)) {
      return res.status(401).send('pleasee enter the date in this format : yyyy-mm-dd');
    }
    const date = new Date(searchQuery);
    const regexPattern = new RegExp(searchQuery, 'i');
    searchCondition = {
      $or: [
        { first_name: regexPattern },
        { last_name: regexPattern },
        { email: regexPattern },
        { phone: regexPattern },
        {
          createdAt: {
            $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            $lte: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
          },
        },
      ],
    };
  }
  const data = await userService.getAllUsers(searchCondition, skip, limit);
  const totalData = await userModel.find().countDocuments();
  const totalPage = Math.ceil(totalData / limit);
  res.send({
    data: data,
    page: page,
    totalPage: totalPage,
    dataPerPage: data?.length,
  });
  // const filter = pick(req.query, ['name', 'role']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  // const result = await userService.queryUsers(filter, options);
  // res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const { username } = req.params;
  const user = await userService.getUserByUsername(username);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.username, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  let { username } = req.query;
  await userService.deleteUserById(req.params.userId, username);
  res.status(httpStatus.NO_CONTENT).send('user deleted successfully!');
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};

// hello
