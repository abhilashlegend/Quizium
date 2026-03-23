const User = require("../models/user");
const mongoose = require("mongoose");

exports.getAllUsers = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;

    try {
        // Explicitly cast to ObjectId. If req.userId is undefined, it defaults to an empty query.
        const query = req.user.userId ? { _id: { $ne: new mongoose.Types.ObjectId(req.user.userId) } } : {};
        
        totalItems = await User.find(query).countDocuments();
        const users = await User.find(query).skip((currentPage - 1) * perPage).limit(perPage);
        if(!users){
            const error = new Error('Could not get users');
            error.statusCode = 404;
            throw error;
        } 
        res.status(200).json({ 
            message: 'Fetched users successfully',
            users: users,
            totalItems: totalItems
        })
    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);

        if(!user){
            const error = new Error("Could not find user");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Fetched user successfully',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
                email: user.email,
            }
        })
    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}