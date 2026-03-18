const express = require('express');

const router = express.Router();
const isAuth = require('../middleware/is-auth');
const userController = require('../controllers/userController');
const { body } = require('express-validator');

router.get('/user-profile/:id',isAuth, userController.getUserProfile);

router.patch('/user-profile/:id',[ body('firstName').trim().notEmpty().withMessage("Please enter first name") ], isAuth, userController.updateUserProfile);

router.patch('/update-password/:id', [
    body('password').trim().isLength({min: 6}).withMessage("Password must be atleast 6 characters in length"),
    body('confirmPassword').trim().custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Passwords do not match!")
        }
        return true;
    })
], isAuth, userController.updatePassword)

module.exports = router;