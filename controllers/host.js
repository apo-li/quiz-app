const Quiz = require('../models/quiz')
const Question = require('../models/question')

exports.showHost = async (req, res) => {
    const {quizId} = req.params;
    const foundQuiz = await Quiz.findOne(quizId);
    const {title, description, creator, questions} = foundQuiz;
    // for (i=0; i<2; i++){
    //     const foundQuestion+i = await Question.findOne(questions[i])
    // }
    const foundQuestion = await Question.findOne(questions[0]);
    const {text} = foundQuestion;
    const {answers} = foundQuestion;
    // for (i=0; i<4; i++){
        
    // }

    res.render('host', 
        {
        id: quizId, 
        title: title, 
        desc: description, 
        creator: creator, 
        questionText: text, 
        answer1: answers[0]
    })
}