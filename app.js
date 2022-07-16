var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//environment variables
require('dotenv').config()

var connection=require("./database/connection")
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/Admin');
//connect to database
connection.connect()
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRouter);
app.use('/', indexRouter);


module.exports = app;
