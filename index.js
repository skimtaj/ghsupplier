const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const DB = require('./DB');
const flash = require('connect-flash');
const session = require('express-session');

const cookieParser = require('cookie-parser'); 
app.use(cookieParser())


app.use(session({
  secret: process.env.session_secret_key,
  resave: false,
  saveUninitialized: true,
}));

app.use(flash())

app.use((req, res, next) => { res.locals.messages = req.flash(); next(); });
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');

const bodyParser = require('body-parser');

app.use(bodyParser.json());


const adminRoute = require('./adminModule/routes/admin_route')
app.use(adminRoute)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log('Server is connected')
})



