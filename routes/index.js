var express = require('express');
const { Apply } = require('../models/Apply');
const { Dashboard } = require('../models/Dashboard');
const { Courses } = require('../models/Courses');
var router = express.Router();


router.get('/', function (req, res, next) {
  if (req.user) {
    if (req.user.admin == true) {
      res.redirect('/admin');
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.render('index', { title: 'HomePage' });
  }

});

router.get('/thankyou', (req, res) => {
  res.render('message', { title: "Thank you - RPP" })
});

router.get('/login', function (req, res, next) {
  if (req.user) {
    if (req.user.admin == true) {
      res.redirect('/admin');
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.render('login', { title: 'Login', message: req.flash('error') });
  }
});

router.get('/books', function (req, res, next) {
  var booktitle = ["At the beach", "In the Tub", "Tasha goes to school", "To the Moon", "It Looks Like A", "My Friend", "Rala the Mathematician", "Shads hat", "Seths Pet", "Want to Play", "What is it", "Who is Here", "Yan Visits the Market", "Zalika and Baba", "On the Mat"];

  var books = ["http://atb.old.readingpartnership.com/", "http://atb.old.readingpartnership.com/inTheTub/", "http://atb.old.readingpartnership.com/tashaGoesToSchool/", "http://atb.old.readingpartnership.com/toTheMoon/", "http://atb.old.readingpartnership.com/itLooksLikeA/", "http://atb.old.readingpartnership.com/myFriend/", "http://atb.old.readingpartnership.com/ralaTheMathematician/", "http://atb.old.readingpartnership.com/shadsHat/", "http://atb.old.readingpartnership.com/sethsPet/", "http://atb.old.readingpartnership.com/wantToPlay/", "http://atb.old.readingpartnership.com/whatIsIt/", "http://atb.old.readingpartnership.com/whoIsHere/", "http://atb.old.readingpartnership.com/yanVisitsTheMarket/", "http://atb.old.readingpartnership.com/zalikaAndBaba/", "http://atb.old.readingpartnership.com/onTheMat/"];
  res.render('books', {booktitle,books});
});

router.get('/book', function (req, res, next) {
  res.render('book', {url: req.query.url});
});

router.get('/coursevideo', function (req, res, next) {
  res.render('video', {url: req.query.url});
});

router.get('/game', function (req, res, next) {
  res.render('game', {url: req.query.url});
});

router.get('/admin', isAdmin, (req, res) => {
  if (req.user.admin == true) {
    Apply.find({}, (err, data) => {

      res.render('admindashboard', { data });
    });

  } else {
    res.send('You are not admin');
  }
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  var coursesdata;
  Courses.find({}, (err, courses) => {
    coursesdata = courses;

    Dashboard.findOne({ useremail: req.user.email }, (err, data) => {

      if (data == null) {
        const newDash = new Dashboard({
          numberofvisit: 1,
          useremail: req.user.email,
          coursedone: 0
        });
        newDash.save();

        res.render('dashboard', { newUser: true, coursesdata, coursedone: 0 });
      } else {


        res.render('dashboard', { newUser: false, coursesdata, coursedone: data.coursedone });
      }

    });
  });


});

router.get('/video/:id/:number',isAuthenticated, (req, res) => {
  Dashboard.findOne({ useremail: req.user.email }, (err, data) => {

    if (data.coursedone <= req.params.number) {

      Dashboard.findByIdAndUpdate(data.id, {
        coursedone: data.coursedone + 1
      }, (err, data) => {
        // console.log(data);
      });
    }
    Courses.findById(req.params.id, (err, data) => {
      res.render('videoplayer', { data });
    });
  });


});

router.get('/newcourse', (req, res) => {

  res.render('newcourse');
});


router.get('/layout', (req, res) => {
  res.render('layoutdesigner');
});

router.post('/newcourse', (req, res) => {
  const newCourse = new Courses({
    title: req.body.title,
    htmlcontent: req.body.htmlcontent
  });
  newCourse.save();
  res.redirect('/dashboard');
});


function isAuthenticated(req, res, done) {
  if (req.user) {
    return done();
  }
  return res.redirect('/login')
}

function isAdmin(req, res, done) {
  if (req.user) {
    if (req.user.admin == true) {
      return done();
    }
  }
  return res.send('You are not authorized')
}

module.exports = router;
