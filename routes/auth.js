const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { user : req.user });
});

router.get('/register', (req, res) => {
  res.render('register', { });
});

router.post('/register', (req, res) => {
  /**
   * Przekierowanie po autoryzacji.
   *
   * @return {undefined}
   */
  function afterAuthenticate() {
    res.redirect('/');
  }

  User.register(
    new User({ username : req.body.username }),
    req.body.password,
    (err, User) => {
      if (err) return res.render('register', { User });

      passport.authenticate('local')(req, res, afterAuthenticate);
    });
});

router.get('/login', (req, res) => {
  res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
