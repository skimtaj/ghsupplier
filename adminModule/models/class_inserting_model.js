const mongoose = require('mongoose');
const classInsertingSchema = mongoose.Schema({

    class_name: {

        type: String,
        trim: true
    },

    subjects: [{

        subject_name: {

            type: String,
            trim: true
        },

        fm: {

            type: Number,
            trim: true
        }
    }]

});

const class_inserting_model = mongoose.model('class_inserting_model', classInsertingSchema);

module.exports = class_inserting_model