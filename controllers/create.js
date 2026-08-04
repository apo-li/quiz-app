// const express = require('express')
const User = require('../models/user')
const Quiz = require('../models/quiz')
const Question = require('../models/question')

// exports.showCreate = (req, res) => {
//     res.render('create', { error: null })
// }

// exports.create = async (req, res) => {       // getting data from the form "action"
//     const { title, description, questions, creator, createdAt, updatedAt } = req.body;
//     const creatorId = req.session.userId;
//     const quiz = new Quiz(title, description, questions, creatorId, createdAt, updatedAt);
//     try {
//         const savedQuiz = await quiz.save();
//         console.log(savedQuiz);
//         res.status(201).redirect(`/create/add-questions/${savedQuiz._id}`);
//     } catch (err) {
//         res.status(500).json({ message: 'Error saving quiz', error: err.message });
//     }
// }

exports.showCreate = (req, res) => {
    res.render('create', { error: null })
}

//create_v1 
exports.create = async (req, res) => {
    const {
        title,
        description,
        questions,
        creator,
        createdAt,
        updatedAt
    } = req.body;

    const creatorId = req.session.userId;

    try {
        // 1. Save the quiz
        const quiz = new Quiz(
            title,
            description,
            [],
            creatorId,
            createdAt,
            updatedAt
        );
        const savedQuiz = await quiz.save();

        // 2. Build question array from req.body
        const questionArray = [];

        let questionNumber = 1;

        while (req.body[`question-text-${questionNumber}`]) {

            const options = [];
            let optionNumber = 1;

            while (req.body[`option-${questionNumber}-${optionNumber}`]) {
                options.push(req.body[`option-${questionNumber}-${optionNumber}`]);
                optionNumber++;
            }

            questionArray.push({
                text: req.body[`question-text-${questionNumber}`],
                options: options,
                correctAnswer: req.body[`correct-answer-${questionNumber}`],
                quizId: savedQuiz._id,
                // points, givenTime, createdAt and updatedAt will use schema defaults
            });

            questionNumber++;
        }

        console.log(questionArray);

        // 3. Save questions
        const questionDocs = await Question.insertMany(questionArray);

        // 4. Save question ids in Quiz table
        const questionIds = questionDocs.map(q => q._id);

        await Quiz.update(savedQuiz._id, {
            questions: questionIds,
            updatedAt: Date.now()
        });

        // 5. Save quiz id in User table
        await User.addQuiz(creatorId, savedQuiz._id);
        res.status(201).json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// exports.showAddQuestions = (req, res) => {
//     const { quizId } = req.params;
//     res.render('create-add-questions', { id: quizId })
// }

// exports.addQuestions = async (req, res) => {  //getting data form form through fetch in createFront.js
//     try {
//         // const { questions } = req.body;
//         // console.log(savedQuiz);
//         const quizId = req.params.quizId;
//         console.log("quiz id is now: ", quizId)
//         const questionArray = req.body.questions;
//         // console.log(questionArray)

//         // 1. Insert questions (expecting an array of question objects)
//         const questionDocs = await Question.insertMany(questionArray); // returns inserted docs

//         const questionIds = questionDocs.map(q => q._id);

//         // 2. Create quiz with those question IDs
//         req.body.updatedAt = Date.now();
//         req.body.questions = questionIds;
//         const updatedQuiz = await Quiz.update(quizId, req.body);
//         console.log(updatedQuiz);
//         res.status(201).json({ success: true, message: "Success!" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: err.message });
//     }
// }