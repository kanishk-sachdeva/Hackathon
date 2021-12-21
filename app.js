var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');

var mongoose = require('mongoose');

// Passport Authentication
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Live Reload
var reload = require('reload');
const { Apply } = require('./models/Apply');


app.listen(3000, () => {
  console.log(`Listening on port 3000`);
})
reload(app);

// MongoDb setup
mongoose.connect("mongodb+srv://test:test@cluster0.4sl2b.mongodb.net/RPP?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(flash());


// BodyParser
app.use(express.json({ extended: true }));
app.use(express.urlencoded({
    extended: false
}));

// Passport Session holder
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));


app.use(passport.initialize());
app.use(passport.session());


// Bootstrap

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/php', express.static(path.join(__dirname, 'public/php')))


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

// Passport
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function (email, password, done) {
      Apply.findOne({ email: email }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
          }
          if (user.password != password) {
              return done(null, false, { message: 'Incorrect password.' });
          }
          if (user.approved == false) {
            return done(null, false, { message: 'Your Account is not Approved.' });
          }
          return done(null, user);
      });
  }
));

passport.serializeUser((user, done) => {
  if (user) {
      return done(null, user.id);
  }
  return done(null, false);
});

passport.deserializeUser((id, done) => {
  Apply.findById(id, (err, user) => {
      if (err) return done(null, false);
      return done(null, user);
  })
});



module.exports = app;
