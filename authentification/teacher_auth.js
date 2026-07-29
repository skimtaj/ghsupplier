const express = require('express');
const app = express();
const JWT = require('jsonwebtoken');
require('dotenv').config();

const cookieParser = require('cookie-parser');

app.use(cookieParser);

const teacherAuth = (req, res, next) => {

    const token = req.cookies.teacherToken;

    if (!token) {
        req.flash('error', 'You are not authenticated. Please sign in to continue');
        return res.redirect('/nababiamission/teacher-credential')
    }

    const verifiedToken = JWT.verify(token, process.env.Teacher_Token_Password);

    req.teacherId = verifiedToken._id;
    next()
};

module.exports = teacherAuth

