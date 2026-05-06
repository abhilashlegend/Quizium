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

exports.updateQuestion = async (req, res, next) => {
    questionId = req.params.questionId;

    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array()
            throw error;
        }

        // Check question exists
        const questionData = await Question.findById(questionId);

        if(!questionData){
            const error = new Error("Question not found");
            error.statusCode = 404;
            throw error;
        }

        const { question, options, correctAnswer } = req.body;

        questionData.question = question;
        questionData.options = options;
        questionData.correctAnswer = correctAnswer;
        const result = await questionData.save();
        res.status(200).json({message:'question has been updated', question: result })

    } catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getQuestions = async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.limit) || 10;
    let totalItems;

    try {
        const quizId = req.params.quizId;
        totalItems = await Question.find({quiz: quizId}).countDocuments();
        const questions = await Question.find({quiz: quizId})
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        if(!questions){
            const error = new Error("Could not get questions");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Fetched questions successfully!',
            questions: questions,
            totalItems: totalItems
        });

    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getQuestion = async (req, res, next) => {
    try {
        const quizId = req.params.quizId;
        const questionId = req.params.questionId;
        const question = await Question.find({quiz: quizId, _id: questionId});
        if(!question){
            const error = new Error("Question not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Fetched question successfully!',
            question: question
        });
    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteQuestion = async (req, res, next) => {
    try {
        const questionId = req.params.questionId;

        // Find the question
        const question = await Question.findById(questionId);
        if(!question){
            const error = new Error("Question not found");
            error.statusCode = 404;
            throw error;
        }

        // Remove question from its quiz
        await Quiz.findByIdAndUpdate(question.quiz, {
            $pull: { questions: questionId }
        });

        // Delete the question itself
        await Question.findByIdAndDelete(questionId);

        res.status(200).json({ message: "Question deleted successfully" });
    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}