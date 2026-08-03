const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: [{
        type: mongoose.SchemaTypes.ObjectId, 
        // ref: 'Question',
        required: true
    }],
    creator:{
        type: mongoose.SchemaTypes.ObjectId,
        // ref: 'User',
        required: true
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

const QuizModel = mongoose.model('Quiz', quizSchema)

class Quiz {
    constructor(title, description, questions, creator, createdAt, updatedAt) {
        this.title = title
        this.description = description
        this.questions = questions
        this.creator = creator
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    async save() {                                                   
        const quiz = new QuizModel({
            title: this.title,
            description: this.description,
            questions: this.questions, 
            creator: this.creator,
            createdAt: this.createdAt ,
            updatedAt: this.updatedAt  
        })
        return await quiz.save();
    }
    
    static async findAll() {
        return await QuizModel.find();
    }

    static async findOne(id) {
        return await QuizModel.findById(id)
    }
    
    static async update(id, data) {
        return await QuizModel.findByIdAndUpdate(id, data, { new: true });
    }
    
    static async delete(id) {
        return await QuizModel.findByIdAndDelete(id);
    }

    static async findByCreatorId(creatorId) {
        return await QuizModel.
                        find().
                        where("creator").
                        equals(creatorId).
                        sort({ createdAt: -1 });
    }
    static async findLastThreeByCreatorId(creatorId) {
        return await QuizModel.
                        find({}, {}, {limit: 3}).
                        where("creator").
                        equals(creatorId).
                        sort({ createdAt: -1 });
    }
}

module.exports = Quiz