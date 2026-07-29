const mongoose = require('mongoose');

constGuardianFeedbackSchema = mongoose.Schema({

    student_name: {

        type: String,
        trim: true
    },

    section: {

        type: String,
        trim: true
    },

    current_class: {

        type: String
    },

    roll_no: {

        type: String
    },

    message: {

        type: String
    }

});




const guardian_feedback_model = mongoose.model('guardian_feedback_model', constGuardianFeedbackSchema);

module.exports = guardian_feedback_model; 