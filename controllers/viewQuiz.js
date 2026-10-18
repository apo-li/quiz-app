const Quiz = require('../models/quiz')
const Question = require('../models/question')

exports.showViewQuiz = async (req, res) => {
    const {quizId} = req.params;
    const refQuiz = await Quiz.findOne(quizId);
    const {title, description, creator} = refQuiz;

    const questions = await Question.findByQuizId(quizId);
    console.log("questions:", questions);

    const questionObjects = questions.map(question => ({
            ...question.toObject(),
            questionIndex: questions.indexOf(question) + 1
        }));
    

    res.render('user/viewQuiz', 
        {
        id: quizId, 
        title,
        description,
        creator,
        questions: questionObjects
    })
}

//just experimenting with ejs yet