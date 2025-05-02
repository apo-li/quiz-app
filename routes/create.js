const express = require('express')
const Quiz = require('../models/quiz')
const Question = require('../models/question')
const router = express.Router()

let savedQuiz;  

router.get('/', (req, res)=>{
    res.render('create', {error: null})
})

router.post('/', async (req, res)=>{       // getting data from the form "action" and names
    const { title, description, questions, creator, createdAt, updatedAt } = req.body;
    const creatorId = req.session.userId;
    const quiz = new Quiz(title, description, questions, creatorId, createdAt, updatedAt);
    try { 
        savedQuiz = await quiz.save();
        console.log(savedQuiz);
        res.status(201).redirect(`/create/add-questions/${savedQuiz._id}`);
        // maybe I can include quiz id in path?
        // e.g.  redirect('/newquiz/id/questions')
    } catch (err) {
        res.status(500).json({ message: 'Error saving quiz', error: err.message });
    }
});

router.get('/add-questions/:quizId', (req, res)=>{
    const {quizId} = req.params;
    res.render('create-add-questions', {id: quizId})
})

// router.post('./add-questions', async (req, res)=>{   // getting data from the form through client side script (using fetch)
//     const { text, answers, correctAnswer, quizId, points, givenTime, createdAt, updatedAt } = req.body;
//     const savedQuizId = savedQuiz._id;
//     const question = new Question(text, answers, correctAnswer, savedQuizId, points, givenTime, createdAt, updatedAt);
//     try { 
//         const savedQuestion = await question.save();
//         console.log(savedQuestion);
//         res.status(201).redirect('/dashboard');
//         // maybe I can include quiz id in path?
//         // e.g.  redirect('/newquiz/id/questions')
//     } catch (err) {
//         res.status(500).json({ message: 'Error saving quiz', error: err.message });
//     }
// })

router.post('/url/:id', (req, res) => {
    console.log('Route hit');
    console.log('params:', req.params);
    res.send('Check console');
  });


router.post('/add-questions/:quizId', async (req, res)=>{
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
        // const question = new Question(text, answers, correctAnswer, savedQuizId, points, givenTime, createdAt, updatedAt);
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
});

module.exports = router