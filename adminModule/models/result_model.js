const mongoose = require('mongoose');
const resultSchema = mongoose.Schema({

    section: {

        type: String
    },

    student_name: {
        type: String,
        trim: true,
    },

    current_class: {
        type: String,
        trim: true,
    },

    roll_no: {
        type: String,
        trim: true,
    },

    remark: {

        type: String
    },

    total_om: {

        type: Number,
        trim: true,
        default: 0
    },

    total_fm: {

        type: Number,
        trim: true,
        default: 0
    },

    result_percentage: {

        type: Number,
        trim: true
    },

    result_status: {

        type: String,
        trim: true
    },

    result: [{

        subject: {

            type: String,
            trim: true
        },

        om: {

            type: Number,
            trim: true,
            default: 0
        },

        fm: {

            type: Number,
            trim: true,
            default: 0
        }
    }]



});

const result_model = mongoose.model('result_model', resultSchema);

module.exports = result_model