const Quiz = require('../models/quiz')
// const Question = require('../models/question')

exports.showHost = async (req, res) => {
    const {quizId} = req.params;
    const foundQuiz = await Quiz.findOne(quizId);
    const {title, description, creator} = foundQuiz;
    res.render('host', {id: quizId, title: title, desc: description, creator: creator})
}