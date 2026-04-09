const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const adminQuizController = require("../controllers/adminQuizController");
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

router.delete('/delete-user/:userId', isAuth, isAdmin, adminController.deleteUser); 

router.post('/add-user/',  [ 
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
 ], isAuth, isAdmin, authController.signup);

 router.get('/quizzes', isAuth, isAdmin, adminQuizController.getQuizzes);

 router.post('/add-quiz/', [
    body('title').trim().notEmpty().withMessage('Please enter title')
 ], isAuth, isAdmin, adminQuizController.addQuiz);

 router.delete('/delete-quiz/:quizId', isAuth, isAdmin, adminQuizController.deleteQuiz);

 router.get('/quiz/:quizId', isAuth, isAdmin, adminQuizController.getQuiz);

 router.patch('/quiz/:quizId', [
    body('title').trim().notEmpty().withMessage('Please enter title')
  ], isAuth, isAdmin, adminQuizController.updateQuiz);

module.exports = router;
