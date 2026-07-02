// const express = require('express')
const Quiz = require('../models/quiz')
const Question = require('../models/question')

exports.showCreate = (req, res) => {
    res.render('create', {error: null})
}

exports.create = async (req, res) => {       // getting data from the form "action"
    const { title, description, questions, creator, createdAt, updatedAt } = req.body;
    const creatorId = req.session.userId;
    const quiz = new Quiz(title, description, questions, creatorId, createdAt, updatedAt);
    try { 
        const savedQuiz = await quiz.save();
        console.log(savedQuiz);
        res.status(201).redirect(`/create/add-questions/${savedQuiz._id}`);
    } catch (err) {
        res.status(500).json({ message: 'Error saving quiz', error: err.message });
    }
}

exports.showCreate_v1 = (req, res) => {
    res.render('create_v1', {error: null})
}

exports.create_v1 = async (req, res) => {       // getting data from the form "action"
    // console.log("req.body.question_1", req.body[`question-text-1`]);
    // const i = 1;
    // const text = req.body[`question-text-${i}`];
    // console.log("text=", text);
    console.log("????? req.body.questions = ", req.body.questions);
    const { title, description, questions, creator, createdAt, updatedAt } = req.body;
    console.log("Questions", questions);
    //KALA KRASA
    // const questionsss = ["6a008e0c85e76e0c4757b9c0"];
    const creatorId = req.session.userId;
    const quiz = new Quiz(title, description, questionsss, creatorId, createdAt, updatedAt);
    try { 
        const savedQuiz = await quiz.save();
        console.log("quiz created: ", savedQuiz);
        console.log("waiting for questions to be saved");
        res.status(201);
    } catch (err) {
        res.status(500).json({ message: 'Error saving quiz', error: err.message });
    }

    // const questions = [ ];
    // for (let i = 1; i <= numOfQuestions; i++){

    //     const text = req.body.[`question-text-${i}`];
    //     const numOfOptions;
    //     const answers = []
    // console.log("text=", text);
    //     const question = new Question(text, answers, correctAnswer, quizId, points, givenTime, createdAt, updatedAt);
        
    // }

    // questionCard
    

    // try{
    //     const savedQuestions = await questions.save();
    // } catch (err) {
    //     res.status(500).json({ message: 'Error saving quiz', error: err.message });
    // }
}

exports.showAddQuestions = (req, res) => {
    const {quizId} = req.params;
    res.render('create-add-questions', {id: quizId})
}

exports.addQuestions = async (req, res) => {  //getting data form form through fetch in createFront.js
    try {
        // const { questions } = req.body;
        // console.log(savedQuiz);
        const quizId  = req.params.quizId;
        console.log("quiz id is now: ", quizId)
        const questionArray = req.body.questions; 
        // console.log(questionArray)
        
        // 1. Insert questions (expecting an array of question objects)
        const questionDocs = await Question.insertMany(questionArray); // returns inserted docs
    
        const questionIds = questionDocs.map(q => q._id);
        
        // 2. Create quiz with those question IDs
        req.body.updatedAt =  Date.now();
        req.body.questions = questionIds;
        const updatedQuiz = await Quiz.update(quizId, req.body);
        console.log(updatedQuiz);
        res.status(201).json({ success: true, message:"Success!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
}