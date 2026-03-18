const User = require("../models/user");
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getUserProfile = (req, res, next) => {
    const userId = req.params.id;
    User.findById(userId).then(user => {
        if(!user){
            const error = new Error("Could not find the user.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "User Profile fetched",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture
            }
        })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.updateUserProfile = (req, res, next) => {
    const userId = req.params.id;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    User.findById(userId).then(user => {
        if(!user){
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        if(user._id.toString() !== userId){
            const error = new Error("You are not authorized");
            error.statusCode = 403;
            throw error;
        }

        if (req.file) {
            const newPicture = req.file.path.replace(/\\/g, "/");
            if (user.picture && user.picture !== newPicture) {
                clearImage(user.picture);
            }
            user.picture = newPicture;
        }

        user.firstName = firstName;
        user.lastName = lastName;
        return user.save();
    }).then(result => {
        res.status(200).json({message: 'User Profile updated!', user: result })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.updatePassword = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }

    const userId = req.params.id;
    const password = req.body.password;

    try {
        User.findById(userId).then(user => {
            if(!user){
                const error = new Error("Could not find user");
                error.statusCode = 404;
                throw error;
            }

            bcrypt.hash(password, 12).then(hashedPwd => {
                user.password = hashedPwd;
                return user.save();
            }).then(result => {
                res.status(201).json({message: 'User password updated!', userId: result._id })
            })
        }).catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
    } catch(err) {
        console.error(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }    
}

exports.getAllUsers = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    try {
        totalItems = await User.find().countDocuments();
        const users = await User.find().skip((currentPage - 1) * perPage).limit(perPage);
        if(!users){
            const error = new Error('Could not get users');
            error.statusCode = 422;
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
        next(error);
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}