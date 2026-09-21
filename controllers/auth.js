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
    const verificationTokenExpires = Date.now() + 60 * 60 * 1000 * 24 * 3;  //expires in 3 days
    const user = new User(username, hashed, firstName, lastName,  email, emailVerified, verificationToken, verificationTokenExpires, quizzes, signupDate);
    try {
        // const usernameAlreadyExists = await User.findByUsername(username);
        // if (usernameAlreadyExists) {
        //     throw new Error ("Username already exists");
        // }
        const savedUser = await user.save();
        
        // res.status(201).json(savedUser);
        req.session.userId = savedUser._id;
        req.session.message = 'Welcome';
        // req.session.nth = 'first';
        res.status(201).redirect('/dashboard');
        // res.send("savedUser: ", savedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error saving user', error: err.message });
    }
    // res.send('Registered!');
    const appDomain = process.env.APP_DOMAIN;
    const verificationUrl = `${appDomain}/verify-email/${verificationToken}`; 
    console.log(verificationUrl);
    await transporter.sendMail({
        from: {
            name: 'QuizMaster',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Verify your QuizMaster email',
        text: `Welcome to Quiz App!

            Please verify your email address by clicking this link:
            ${verificationUrl}

            This link will expire in 1 hour.`,

        html: `
            <h2>Welcome to Quiz App!</h2>

            <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>

            <p>
                <a href="${verificationUrl}">Verify my email</a>
            </p>

            <p>This verification link will expire in 3 days.</p>

            <p>If you didn't create an account, you can safely ignore this email.</p>
        `
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