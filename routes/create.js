const express = require('express')
const Quiz = require('../models/quiz')
const router = express.Router()

router.get('/', (req, res)=>{
    res.render('create', {error: null})
})

router.post('/', async (req, res)=>{
    const { title, description, questions, creator, createdAt, updatedAt } = req.body;
    const creatorId = req.session.userId;
    const quiz = new Quiz(title, description, questions, creatorId, createdAt, updatedAt);
    try { 
        const savedQuiz = await quiz.save();
        console.log(savedQuiz);
        res.status(201).redirect('/create/questions');
        // maybe I can include quiz id in path?
        // e.g.  redirect('/newquiz/id/questions')
    } catch (err) {
        res.status(500).json({ message: 'Error saving quiz', error: err.message });
    }
});

module.exports = router