const User = require("../models/user");
const mongoose = require("mongoose");
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

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

exports.updateUser = async (req, res, next) => {
    const userId = req.params.userId;
    const errors = validationResult(req);

    console.log(req.body);

    if(!errors.isEmpty()){
        const error = new Error("Validation failed, entered data is incorrect.");
        error.statusCode = 422;
        throw error;
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findById(userId);

        if(!user){
            const error = new Error("Could not find user");
            error.statusCode = 404;
            throw error;
        }

        if(req.file){
            const newPicture = req.file.path.replace(/\\/g, "/");
            if(user.picture && user.picture !== newPicture){
                clearImage(user.picture);
            }
            user.picture = newPicture;
        }

        if(password && password.trim() !== ''){
            const hashedPwd = await bcrypt.hash(password, 12);
            user.password = hashedPwd;
        }

        

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
      
        const result = await user.save();
        res.status(200).json({message:'user has been updated', user: result, })

    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteUser = (req, res, next) => {
    const userId = req.params.userId;

    User.findById(userId).then(user => {
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        if(user.picture){
            clearImage(user.picture);
        }
        
        return User.findByIdAndDelete(userId);
    }).then(result => {
        res.status(200).json({ message: 'user has been deleted' })
    }).catch(error => {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}