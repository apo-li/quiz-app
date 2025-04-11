const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    quizzes:[{
        type: mongoose.SchemaTypes.ObjectId,
        // ref: 'Quiz',   //or 'QuizModel'? 
        required: true
    }],
    signupDate: {
        type: Date,
        required: true,
        default: Date.now
    }
    // quizzes: [mongoose.SchemaTypes.ObjectId]
    
})

// module.exports = mongoose.model('User', userSchema)   //gia ylopoihsh xwris classes

//////////////////////////////////////////////

////      ylopoihsh me oop (classes)      ////

const UserModel = mongoose.model('User', userSchema)

class User {
    constructor(name, email, quizzes, signupDate) {
        this.name = name
        this.email = email
        this.quizzes = quizzes
        this.signupDate = signupDate
    }

    async save() {                                                   
        const user = new UserModel({
            name: this.name,
            email: this.email,
            quizzes: this.quizzes, 
            signupDate: this.signupDate 
        })
        return await user.save();
    }
    
    static async findAll() {
        return await UserModel.find();
    }

    static async findOne(id) {
        return await UserModel.findById(id)
    }
    
    static async update(id, data) {
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    }
    
    static async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}

module.exports = User