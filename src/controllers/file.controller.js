const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const upload = require('../utils/fileUpload')


const fileUplaod = catchAsync(
    async (req,res) => {
        await new Promise((resolve, reject) => {
            upload.single('file')(req, res, (err) => {
                if (err) {
                    reject(err);
                } else {
                    if (!req.file) {
                        reject(new ApiError('No file uploaded'));
                    } else {
                        path = `http://localhost:3000/${req.file.path}`;
                        resolve();
                    }
                }
            });
        });
        res.send({ message: 'File uploaded successfully', path: path })
   }
) 


module.exports = {fileUplaod};