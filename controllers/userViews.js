const User = require('../models/user');
const Quiz = require('../models/quiz');
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

exports.showDashboard = async (req, res) => {
    const { userId } = req.session;
    const { message } = req.session;
    const loggedUser = await User.findOne(userId);
    const quizzes = await Quiz.findLastThreeByCreatorId(userId);

    const nth = (!quizzes.length) ? 'first' : 'next';

    const quizCards = quizzes.map(quiz => ({
        ...quiz.toObject(),
        createdAgo: dayjs(quiz.createdAt).fromNow()
    }));

    await res.render('user/dashboard', {
        message,
        nth,
        username: loggedUser.firstName,
        quizzes: quizCards,
        error: null
    })
}

exports.showMyQuizzes = async (req, res) => {
    const { userId } = req.session;
    const { message } = req.session;
    const quizzes = await Quiz.findByCreatorId(userId);

    const quizCards = quizzes.map(quiz => ({
        ...quiz.toObject(),
        createdAgo: dayjs(quiz.createdAt).fromNow(),
        createdAtFormat: dayjs(quiz.createdAt).format("DD-MM-YYYY"),
        numOfQuestions: quiz.questions.length
    }));

    await res.render('user/myQuizzes', {
        message: message, 
        quizzes: quizCards,
        error: null
    })
}