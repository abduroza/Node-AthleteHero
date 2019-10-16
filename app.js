var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var env = require('dotenv').config();
var cors = require('cors');

var database_host = '';
if (process.env.DB_TYPE === 'LOCAL') {
  database_host = process.env.DB_HOST_LOCAL;
} else if (process.env.DB_TYPE === 'DEVELOP') {
  database_host = process.env.DB_HOST_DEVELOP;
}

mongoose.set('useCreateIndex', true);
mongoose.connect(database_host, { useNewUrlParser: true, useFindAndModify: false });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var api = require('./routes/api/v1/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
