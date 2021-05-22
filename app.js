const express = require('express');
const mysql = require("mysql");
const dotenv = require('dotenv');
const path = require('path');
const {request} = require('http');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const {Sequelize} = require('sequelize');
const SequelizeAuto = require('sequelize-auto-models')


const flash = require('express-flash')



//Private file
dotenv.config({
    path: './.env'
});

const app = express();

// In order to flash messages
app.use(flash())

//Connection with the database
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE,
});

//Sessions configuration
app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 180 * 60 * 1000
    }
}))

const sessionStore = new MySQLStore({
    expiration: 86400000
}, db);

app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.session = req.session;
    next();
})

//Sequelize for database
const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, '', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//Client side files directory (css)
const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory));

//Parse URL-encoded bodies as sent by HTML forms
app.use(express.urlencoded({
    extended: false
})); 

//Parse JSON bodies (as sent by API clients)
app.use(express.json()); 

app.use(cookieParser());

const hbspartials = require('hbs')

//View handlebars pages
app.set('view engine', 'hbs');
hbspartials.registerPartials(path.join(__dirname, "/views/partials"))

app.use(fileUpload());

//Check database connection
db.getConnection((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MYSQL CONNECTED");
    }
})

//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/data', require('./routes/data'));
app.use('/shop', require('./routes/shop'));


app.listen(8080, () => {
    console.log("Server started at port 8080");

})