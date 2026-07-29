const express = require('express');
const app = express();
const JWT = require('jsonwebtoken');
require('dotenv').config();

const cookieParser = require('cookie-parser');

app.use(cookieParser);

const adminAuth = (req, res, next) => {

    const token = req.cookies.adminToken;

    if (!token) {
        req.flash('error', 'You are not authenticated. Please sign in to continue');
        return res.redirect('/nababiamission/nm-admin')
    }

    const verifiedToken = JWT.verify(token, process.env.Admin_Token_Password);

    req.adminId = verifiedToken._id;
    next()
};

module.exports = adminAuth

