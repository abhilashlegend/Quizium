const express = require('express');

const router = express.Router();
const isAuth = require('../middleware/is-auth');
const userController = require('../controllers/userController');

router.get('/user-profile/:id',isAuth, userController.getUserProfile);

module.exports = router;