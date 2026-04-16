const Question = require('../models/question');
const Quiz = require('../models/quiz');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

exports.addQuestion = async (req, res, next) => {
    try  {
        const quizId = req.params.quizId;
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        // Check quiz exists
        const quiz = await Quiz.findById(quizId);
        if(!quiz) {
            const error = new Error("Quiz not found");
            error.statusCode = 404;
            throw error;
        }

        const { question, options, correctAnswer } = req.body;

        const questionData = new Question({
            quiz: quizId,
            question: question,
            options: options,
            correctAnswer: correctAnswer
        });

        const result = await questionData.save();

        // Link question to quiz
        quiz.questions.push(result._id);
        await quiz.save();

        res.status(201).json({message: 'Question added successfully', question: result })

    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}