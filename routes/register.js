const bcrypt = require('bcrypt');
const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/home', (req, res)=>{
    res.render('home', {error: null})
})

router.get('/register', (req, res) => {
    res.render('register', { error: null })
})

router.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, email, quizzes, signupDate } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User(username, hashed, firstName, lastName,  email, quizzes, signupDate);
    try {
        const savedUser = await user.save();
        // res.status(201).json(savedUser);
        req.session.userId = user._id;
        res.status(201).redirect('/dashboard');
    } catch (err) {
        res.status(500).json({ message: 'Error saving user', error: err.message });
    }
    // res.send('Registered!');
});

router.get('/login', (req, res) => {
    res.render('login', { error: null })
})

router.post('/login', async (req, res) => {
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
        res.status(201).redirect('/protected');
    } catch (err) {
        res.status(500).json({message: 'Error loggin in', error: err.message});
    }
});


router.get('/protected', isAuth, (req, res) => {
    res.send('You are authenticated!');
});

function isAuth(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.status(401).send('Not authorized');
};

module.exports = router