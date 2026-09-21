const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user');
const Quiz = require('../models/quiz');
const transporter = require('../utils/email');
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

exports.showHome = (req, res)=>{
    res.render('home', {error: null});
}

exports.showDashboard = async (req, res) => {
    const {userId} = req.session;
    const {message} = req.session;
    const loggedUser = await User.findOne(userId);
    const quizzes = await Quiz.findLastThreeByCreatorId(userId);

    const nth = (!quizzes.length) ? 'first' : 'next' ;
    
    const quizCards = quizzes.map(quiz => ({
        ...quiz.toObject(),
        createdAgo: dayjs(quiz.createdAt).fromNow()
    }));

    await res.render('user/dashboard', { 
        message: message,
        nth: nth,
        username: loggedUser.firstName,  
        quizzes: quizCards,
        error: null 
    })
}

exports.showMyQuizzes = async (req, res) => {
    const {userId} = req.session;
    const {message} = req.session;
    // const loggedUser = await User.findOne(userId);
    const quizzes = await Quiz.findByCreatorId(userId);

    // const nth = (!quizzes.length) ? 'first' : 'next' ;
    
    const quizCards = quizzes.map(quiz => ({
        ...quiz.toObject(),
        createdAgo: dayjs(quiz.createdAt).fromNow(),
        createdAtFormat: dayjs(quiz.createdAt).format("DD-MM-YYYY"),
        numOfQuestions: quiz.questions.length
    }));

    await res.render('user/myQuizzes', { 
        message: message,
        // nth: nth,
        // username: loggedUser.firstName,  
        quizzes: quizCards,
        error: null 
    })
}

exports.showRegister = (req, res) => {
    res.render('register', { error: null })
}

exports.showLogin = (req, res) => {
    res.render('login', { error: null })
}


exports.register = async (req, res) => {
    const { username, password, firstName, lastName, email, emailVerified, quizzes, signupDate } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 60 * 60 * 1000;  //expires in 1 hour
    const user = new User(username, hashed, firstName, lastName,  email, emailVerified, verificationToken, verificationTokenExpires, quizzes, signupDate);
    try {
        // const usernameAlreadyExists = await User.findByUsername(username);
        // if (usernameAlreadyExists) {
        //     throw new Error ("Username already exists");
        // }
        const savedUser = await user.save();
        
        // res.status(201).json(savedUser);
        req.session.userId = await savedUser._id;
        req.session.message = 'Welcome';
        // req.session.nth = 'first';
        res.status(201).redirect('/dashboard');
        // res.send("savedUser: ", savedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error saving user', error: err.message });
    }
    // res.send('Registered!');
    const verificationUrl = `http:localhost:3000/verify-email/${verificationToken}`; 

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your Quiz App email',
        text: `Please verify your email by clicking this link: ${verificationUrl}`
    });
}


exports.login = async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).send('User not found');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Wrong password')
        };
        req.session.userId = user._id;
        req.session.message = 'Welcome back';
        res.status(201).redirect('/dashboard');
    } catch (err) {
        res.status(500).json({message: 'Error loggin in', error: err.message});
    }
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
}

exports.showEmailVerified = async (req, res) => {
    try {
        const user = await User.findByVerificationToken(req.params.token);

        if (!user) {
            return res.status(400).send('Invalid or expired verification link.');
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();
        res.status(200).render('emailVerified');
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong.');
    }
}