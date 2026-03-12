const User = require("../models/user");
const fs = require('fs');
const path = require('path');

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