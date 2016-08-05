const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const httpCodes = require('http-codes');
const debug = require('debug')('express-server:database');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const routes = require('./routes/index');
const users = require('./routes/users');

const db = require('./modules/database/database');

const User = require('./models/user');

const app = express();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err)
      return done(err);
    if (!user)
      return done(null, false, { message: 'Incorrect username.' });
    if (!user.validPassword(password))
      return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  });
}));

passport.use('signup', new LocalStrategy({
  passRequestToCallback: true
}, (req, username, password, done) => {
  console.log('test');
  function findOrCreateUser() {
    console.log(username, password);
    done(null, {});
  }

  process.nextTick(findOrCreateUser);
}));

// connect to mongoDB
db.connect()
  .then(() => {
    debug('Database connected');
  })
  .catch((error) => {
    debug(error);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(passport.initialize()) ;
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);

app.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/signup'
}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log('404 kurwa');
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || httpCodes.INTERNAL_SERVER_ERROR);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || httpCodes.INTERNAL_SERVER_ERROR);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
