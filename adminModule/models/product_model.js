
const mongoose = require('mongoose');
const productSchema = mongoose.Schema({

    product_name: {

        type: String
    },

    category: {

        type: String
    },

    unit: {

        type: String
    },

    purchase_price: {

        type: Number
    },

    sale_price: {

        type: Number
    },

    description: {

        type: String
    },

    stock_qty: {

        type: Number
    }
});

const product_model = mongoose.model('product_model', productSchema);

module.exports = product_model;

