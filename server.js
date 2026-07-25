require('dotenv').config()

const express = require("express")
const mongoose = require('mongoose')

//////
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const app = express()
const path = require ('path')
//////

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

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
    collectionName: 'cookie-sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true, //dev only
    secure: false, // set to true if using HTTPS
  }
}));

/////////////////////

///// routes ///

const routes = require('./routes');
app.use(routes);

const usersRouter = require('./routes/users')           //api routes
const quizzesRouter = require('./routes/quizzes')       //api routes
const questionsRouter = require('./routes/questions')   //api routes
// const registerUser = require('./routes/register')
// const createRouter = require('./routes/create') 

app.use('/api/users', usersRouter)              //localhost:3000/api/users
app.use('/api/quizzes', quizzesRouter)
app.use('/api/questions', questionsRouter)
// app.use('/', registerUser)
// app.use('/create', createRouter)

app.listen(3000, ()=> console.log('Server Started'))