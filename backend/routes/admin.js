const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const adminController = require("../controllers/adminController");

router.get('/users', isAuth, isAdmin, adminController.getAllUsers);

router.get('/user/:userId', isAuth, isAdmin, adminController.getUser);

module.exports = router;
