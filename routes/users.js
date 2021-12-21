var express = require('express');
const { Apply } = require('../models/Apply');
const { Dashboard } = require('../models/Dashboard');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res) => {
  res.render('registration', { success: true });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
  if (req.user.admin == true) {
    res.redirect('/admin');
  } else {
    res.redirect('/dashboard');
  }
});

router.get('/logout', function (req, res) {
  req.logOut();
  res.redirect('/login')
})

router.post('/register', (req, res) => {

  Apply.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      var mailOptions = {
        from: 'youremail@gmail.com',
        to: req.body.email,
        subject: 'We got your application for RPP',
        text: `Thank you ${req.body.parentname}, we got your application and will review your application soon.`
      };
      sendEmail(mailOptions);
      var randPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');

      const { email, name, parentname, relation, age, ethnicity, address, hearaboutus, reason } = req.body;
      const newApplication = new Apply({
        email, name, parentname, relation, age, ethnicity, address, hearaboutus, reason
        , approved: false, password: randPassword, admin: false
      });
      newApplication.save();
      res.render('registration', { success: false });
    } else {
      res.render('registration', { success: false, message: true });
    }
  });


});

router.get('/disable/:id', isAdmin, (req, res) => {
  Apply.findById(req.params.id, (err, data) => {

    var mailOptions = {
      from: 'youremail@gmail.com',
      to: data.email,
      subject: 'Account Disabled or Application Not Approved',
      text: `OOps ${data.parentname}, Your account with us has been disabled/not approved!. Contact us for more info .`
    };
    sendEmail(mailOptions);
    Apply.findByIdAndUpdate(req.params.id, {
      approved: false
    }, (err, data) => {
      res.redirect('/admin')
    });
  });
  
});

router.get('/enable/:id',isAdmin, (req, res) => {

  // Dashboard.findOne({userid: req.params.id}, {

  // })

  Apply.findById(req.params.id, (err, data) => {
    var mailOptions = {
      from: 'youremail@gmail.com',
      to: data.email,
      subject: 'Account Approved/Enabled, Your Login Credentials',
      text: `Congo ${data.parentname}, Your account with us has been approved!. Here are your login credentials \nEmail: ${data.email}\nPassword: ${data.password}`
    };
    sendEmail(mailOptions);

    // const dashboard = new Dash

    Apply.findByIdAndUpdate(req.params.id, {
      approved: true
    }, (err, data) => {
      res.redirect('/admin')
    });

  });

});

function isAdmin(req, res, done) {
  if (req.user) {
    if (req.user.admin == true) {
      return done();
    }
  }
  return res.send('You are not authorized')
}

function isAuthenticated(req, res, done) {
  if (req.user) {
    return done();
  }
  return res.redirect('/login')
}

function sendEmail(mailOptions) {
  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'admin@kanishk.com',
      pass: 'password'
    }
  });

  // var mailOptions = {
  //   from: 'youremail@gmail.com',
  //   to: 'kskanu2020@gmail.com',
  //   subject: 'Sending Email using Node.js',
  //   text: 'That was easy!'
  // };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
  });

};

module.exports = router;
