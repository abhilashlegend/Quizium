const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error("Validation failed.");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const { firstName, lastName, email, password } = req.body;
        let picture = null;
        if(req.file){
            picture = req.file.path.replace(/\\/g, "/");
        }
        
        const hashedPwd = await bcrypt.hash(password, 12);
        
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            picture: picture,
            email: email,
            password: hashedPwd
        });

        const result = await user.save();

        const token = jwt.sign({
            email: result.email,
            userId: result._id.toString()
        }, 'somesupersecretsecret', { expiresIn: '1h' }); // Use an environment variable for the secret

        res.status(201).json({ token: token, userId: result._id.toString() });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}