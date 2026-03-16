const express = require('express');

const router = express.Router();
const isAuth = require('../middleware/is-auth');
const userController = require('../controllers/userController');
const { body } = require('express-validator');

router.get('/user-profile/:id',isAuth, userController.getUserProfile);

router.patch('/user-profile/:id',[ body('firstName').trim().notEmpty().withMessage("Please enter first name") ], isAuth, userController.updateUserProfile);

module.exports = router;