const Quiz = require('../models/quiz');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

exports.getQuizzes = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;

    try {
        totalItems = await Quiz.find().countDocuments();
        const quizzes = await Quiz.find().skip((currentPage - 1) * perPage).limit(perPage);


        if(!quizzes){
            const error = new Error("Could not get quizzes");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Fetched quizzes successfully!',
            quizzes: quizzes,
            totalItems: totalItems
        })

    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }
}

exports.addQuiz = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error("Validation failed!");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const { title, description } = req.body;

        const quiz = new Quiz({
            title:title, 
            description: description,
            createdBy: req.user.userId,
            questions: []
        });

        const result = await quiz.save();

        res.status(201).json({message: 'Quiz has been added', quiz })

    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}