var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// enable CORS()
var cors = require('cors')
app.use(cors())

const PORT = process.env.PORT || 3000; // Step 1

// kết nối
const mongoose = require('mongoose')

const url = "mongodb+srv://eltr:eltr@cluster0.5yjox.mongodb.net/dbProduct?retryWrites=true&w=majority"

app.use(express.json())

mongoose.connect(process.env.MONGODB_URI || url ,{useUnifiedTopology: true, useNewUrlParser:true}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
// kết thúc kết nối


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
