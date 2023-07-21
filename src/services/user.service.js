const httpStatus = require('http-status');
const userModel = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const Redis = require('ioredis');
const client = new Redis();
const addressModel = require('../models/address.model');
const blogModel = require('../models/blog.model');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await userModel.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return userModel.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// const queryUsers = async (filter, options) => {
//   const users = await User.paginate(filter, options);
//   return users;
// };

const getAllUsers = async (searchCondition, skip, limit) => {
  return await userModel.aggregate([
    {
      $match: searchCondition,
    },
    {
      $lookup: {
        from: 'addresses',
        localField: '_id',
        foreignField: 'user_id',
        as: 'user-details',
      },
    },
    {
      $unwind: '$user-details',
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
        username: 1,
        first_name: 1,
        last_name: 1,
        phone: 1,
        email: 1,
        profile: 1,
        createdAt: 1,
        user_details: '$user-details',
      },
    },
  ]);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  const userRedisData = await client.hgetall(username);
  if (Object.keys(userRedisData).length !== 0) {
    console.log('data comes from redis server');
    return userRedisData;
  } else {
    const user = await userModel.aggregate([
      {
        $match: { username: username },
      },
      {
        $lookup: {
          from: 'addresses',
          localField: '_id',
          foreignField: 'user_id',
          as: 'user-details',
        },
      },
      {
        $unwind: '$user-details',
      },
      {
        $project: {
          username: 1,
          first_name: 1,
          last_name: 1,
          phone: 1,
          email: 1,
          profile: 1,
          street: '$user-details.street',
          city: '$user-details.city',
          state: '$user-details.state',
        },
      },
    ]);
    const redisData = {};
    user.forEach(async (element) => {
      for (let key in element) {
        redisData[key] = element[key];
      }
    });
    await client.hset(username, redisData);
    return user;
  }
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return userModel.findOne({ email });
};

const getUserById = async (id) => {
  return await userModel.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (username, updateBody) => {
  let insertedUsername = updateBody.username ? updateBody.username : username;
  const user = await userModel.findOne({ username: username });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updatedUser = await userModel.findOneAndUpdate(
    { username: username },
    {
      $set: updateBody,
    },
    { new: true }
  );

  const redisUser = await client.hgetall(username);
  for (let key in updatedUser) {
    if (redisUser.hasOwnProperty(key) && redisUser[key] !== updatedUser[key]) {
      redisUser[key] = updatedUser[key];
    }
  }

  await client.hset(insertedUsername, redisUser);
  return updatedUser;
  // if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  // Object.assign(user, updateBody);
  // await user.save();
  // return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, username) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await userModel.findByIdAndDelete(userId);
  await addressModel.deleteOne({ user_id: userId });
  await blogModel.deleteOne({created_by : userId})
  await client.del(username);
  return;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserById,
};
