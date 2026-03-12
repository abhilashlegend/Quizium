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

        res.status(201).json({ message: 'signup successfull!', userId: result._id.toString() });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.signin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const jwtkey = process.env.JWT_SECRET;

    User.findOne({email: email}).then(user => {
        if(!user){
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    }).then(isEqual => {
        if(!isEqual){
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            role: user.role,
            userId: loadedUser._id.toString()
        }, jwtkey, { expiresIn: '1h'});

        res.status(200).json({token: token, userId: loadedUser._id.toString() });
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}