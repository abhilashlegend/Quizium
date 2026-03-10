const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/authController');

router.post('/signup', [ 
    body('firstName').trim().notEmpty().withMessage('Please enter first name'),
    body('email').isEmail().withMessage("Please enter valid email address").custom((value, {req}) => {
        return User.findOne({email: value}).then(userDoc => {
            if(userDoc){
                return Promise.reject('Email already exists')
            }
        })
    }).normalizeEmail(),
    body('password').trim().isLength({min:6}).withMessage("Password must be atleast 6 characters in length"),
    body('confirmPassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })
 ], authController.signup);

 router.post('/signin', [
    body('email').isEmail().withMessage("Please enter valid email address").custom((value, {req}) => {
        return User.findOne({email: value}).then(userdoc => {
            if(!userDoc){
                return Promise.reject("Account does not exists, please signup!");
            }
        })    
    }).normalizeEmail(),
    body('password').trim().notEmpty().withMessage("Please enter password")
 ], authController.signin);


 module.exports = router;