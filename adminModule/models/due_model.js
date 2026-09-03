const mongoose = require('mongoose');
const dueSchema = mongoose.Schema({


    customer_name: {

        type: String
    },

    mobile: {

        type: String
    },

    invoice_no: {

        type: String
    },

    payment_date: {

        type: String
    },

    payment_amount: {

        type: Number
    },

    payment_method: {

        type: String
    },

});

const due_model = mongoose.model('due_model', dueSchema);

module.exports = due_model;