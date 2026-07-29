
require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const JWT = require('jsonwebtoken');

const teacherSchema = mongoose.Schema({

    email: {

        type: String,
        trim: true
    },

    password: {

        type: String,
        trim: true
    },


    tokens: [{

        token: {

            type: String
        }
    }]

});


teacherSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
});



teacherSchema.methods.teacherTokenGenerate = async function () {

    const token = JWT.sign({ _id: this._id.toString() }, process.env.Teacher_Token_Password, { expiresIn: '365d' });
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
}


const teacher_signup_model = mongoose.model('teacher_signup_model', teacherSchema);

module.exports = teacher_signup_model;






