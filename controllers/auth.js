const bcrypt = require('bcrypt')
const User = require('../models/user');

exports.home = (req, res)=>{
    res.render('home', {error: null})
    console.log('welcome home')
}

exports.showRegister = (req, res) => {
    res.render('register', { error: null })
}

exports.register = async (req, res) => {
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
}


exports.showLogin = (req, res) => {
    res.render('login', { error: null })
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
        res.status(201).redirect('/dashboard');
    } catch (err) {
        res.status(500).json({message: 'Error loggin in', error: err.message});
    }
}

// exports.logout = (req, res) => {
//     req.session.destroy(() => {
//       res.redirect('/');
//     });
//   }