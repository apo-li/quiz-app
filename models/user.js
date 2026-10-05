const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpires: {
        type: Date
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
})

// module.exports = mongoose.model('User', userSchema)   //gia ylopoihsh xwris classes

//////////////////////////////////////////////

////      ylopoihsh me classes      ////

const UserModel = mongoose.model('User', userSchema)

class User {
    constructor({
        username, 
        password, 
        firstName, 
        lastName, 
        email, 
        emailVerified, 
        verificationToken, 
        verificationTokenExpires, 
        resetPasswordToken, 
        resetPasswordTokenExpires, 
        quizzes, 
        signupDate
    }) {
        this.username = username
        this.password = password
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.emailVerified = emailVerified
        this.verificationToken = verificationToken
        this.verificationTokenExpires = verificationTokenExpires
        this.resetPasswordToken = resetPasswordToken
        this.resetPasswordTokenExpires = resetPasswordTokenExpires
        this.quizzes = quizzes
        this.signupDate = signupDate
    }

    async save() {                                                   
        const user = new UserModel({
            username: this.username, 
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            emailVerified: this.emailVerified,
            verificationToken: this.verificationToken,
            verificationTokenExpires: this.verificationTokenExpires,
            resetPasswordToken: this.resetPasswordToken,
            resetPasswordTokenExpires: this.resetPasswordTokenExpires,
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

    static async findByEmail(emailToFind) {
        return await UserModel.findOne({email: emailToFind})
    }

    static async findByUsername(userNameToFind){
        return await UserModel.findOne({username: userNameToFind})
    } 
    
    static async findByVerificationToken(verificationToken){
        return await UserModel.findOne({
            verificationToken: verificationToken,
            verificationTokenExpires: { $gt: Date.now() }
        })
    }

    static async update(id, data) {
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    }
    
    static async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }

    static async addQuiz(userId, quizId) {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    quizzes: quizId
                }
            },
            { new: true }
        );
    }
}

module.exports = User