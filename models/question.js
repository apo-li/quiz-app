const mongoose = require('mongoose')
// import mongoose from 'mongoose'
const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    answers: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    quizId: {
        type: mongoose.SchemaTypes.ObjectId, 
        ref: 'Quiz',
        required: true
    },
    points: {
        type: Number,
        required: true,
        default: 100
    },
    givenTime: {
        type: Number,
        required: true,
        default: 30
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const QuestionModel = mongoose.model('Question', questionSchema)

class Question {
    constructor(text, answers, correctAnswer, quizId, points, givenTime, createdAt, updatedAt) {
        this.text = text
        this.answers = answers
        this.correctAnswer = correctAnswer
        this.quizId = quizId
        this.points = points
        this.givenTime = givenTime
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    async save() {                                                   
        const question = new QuestionModel({
            text: this.text,
            answers: this.answers,
            correctAnswer: this.correctAnswer,
            quizId: this.quizId, 
            points: this.points,
            givenTime: this.givenTime,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt  
        })
        return await question.save();
    }
    
    static async insertMany(array){
        return await QuestionModel.insertMany(array);
    }

    static async findAll() {
        return await QuestionModel.find();
    }

    static async findOne(id) {
        return await QuestionModel.findById(id)
    }
    
    static async update(id, data) {
        return await QuestionModel.findByIdAndUpdate(id, data, { new: true });
    }
    
    static async delete(id) {
        return await QuestionModel.findByIdAndDelete(id);
    }
}

module.exports = Question