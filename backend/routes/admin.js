const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

router.get('/users', isAuth, isAdmin, userController.getAllUsers);

module.exports = router;
