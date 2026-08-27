const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
require('dotenv').config();

const JWT = require('jsonwebtoken')

app.use(cookieParser());

const adminAuth =  (req, res, next) => {

    const token = req.cookies.adminToken;
    if (!token) {
        req.flash('error', 'You are not authorized');
        return res.redirect('/ghsupplier/auth/login')
    };

    const verifiedToken =  JWT.verify(token, process.env.Admin_Token_Password);
    req.adminId = verifiedToken._id;

    next();

};

module.exports = adminAuth