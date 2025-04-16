require('dotenv').config()

const express = require("express")
const mongoose = require('mongoose')

//////
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const app = express()
//////

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error)=> console.error(error))
db.once('open', ()=> console.log('Connected to Database'))

app.use(express.json())

////////////////////     cookies-session
app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET_KEY , 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: false, // set to true if using HTTPS
  }
}));

/////////////////////

///// routes ///
const usersRouter = require('./routes/users')
const quizzesRouter = require('./routes/quizzes')
const questionsRouter = require('./routes/questions')
const registerUser = require('./routes/register')

app.use('/users', usersRouter)
app.use('/quizzes', quizzesRouter)
app.use('/questions', questionsRouter)
app.use('/', registerUser)

app.listen(3000, ()=> console.log('Server Started'))