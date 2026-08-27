const mongoose = require('mongoose');
const billingSchema = mongoose.Schema({


    invoice_no: {

        type: String
    },

    customer_name: {

        type: String,
        trim: true
    },

    mobile: {

        type: String,
        trim: true
    },

    address: {

        type: String,
        trim: true
    },

    billing_date: {

        type: String,
        trim: true
    },

    grand_total: {

        type: Number,
        trim: true
    },

    rupees_in_words: {

        type: String
    },

    payment_method: {

        type: String
    },

    items: [{

        item_name: {

            type: String,
            trim: true
        },

        description: {

            type: String,
            trim: true
        },

        unit: {

            type: String
        },

        qty: {

            type: Number
        },

        rate: {

            type: Number
        },

        total: {

            type: Number
        },

        profit: {

            type: Number
        },

    }]

});

const billing_model = mongoose.model('billing_model', billingSchema);
module.exports = billing_model