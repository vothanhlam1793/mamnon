var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//mongodb+srv://black:asrkpvg7@cluster0-dmhml.gcp.mongodb.net/dangnhap?retryWrites=true&w=majority
//connect to MongoDB
const uri = "mongodb+srv://black:asrkpvg7@cluster0-dmhml.gcp.mongodb.net/ngochoang?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Successfully connected to the database");
});



var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var userController = require("./controller/user_controller");
var groupController = require("./controller/group_controller");
var cameraController = require("./controller/camera_controller");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use('/', indexRouter);
app.use('/users', userController);
app.use("/cameras", cameraController);
app.use("/groups", groupController);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
    //res.redirect("/logout");
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
