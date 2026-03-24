const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const adminController = require("../controllers/adminController");
const { body } = require('express-validator');
const User = require('../models/user');

router.get('/users', isAuth, isAdmin, adminController.getAllUsers);

router.get('/user/:userId', isAuth, isAdmin, adminController.getUser);

router.patch('/user/:userId', [ body('firstName').trim().notEmpty().withMessage("First Name is missing"),
    body('email').isEmail().withMessage('Email is not valid').custom((value, {req}) => {
        return User.findOne({email: value}).then(userDoc => {
            if(userDoc && userDoc._id.toString() !== req.params.userId){
                return Promise.reject('User with that email already exists!')
            }
        })
    }).normalizeEmail(),
   body('password').optional({ checkFalsy: true }).isLength({min: 6 }).withMessage("Password must be atleast 6 characters in length"),
   body('confirmPassword').custom((value, {req}) => {
        if(value !== req.body.password && req.body.password){
            throw new Error("Passwords have to match!");
        }
        return true;
    })
 ], isAuth, isAdmin, adminController.updateUser);

module.exports = router;
