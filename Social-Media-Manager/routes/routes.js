// routes.js
var nodeMailer = require("nodemailer");
var ejs = require("ejs");
var fs = require("fs");
var request = require('request-promise');
var configAuth = require('../config/auth');
var ig = require('instagram-node').instagram();

module.exports = function(app, passport) {

  const userFieldSet = 'name, link, picture, created_time, message, story, id';
  const pageFieldSet = 'name, message, story, comments{comments{attachments,from,id,message,created_time},from,id,message,created_time}, category, link, picture, is_verified, attachments, created_time';

  var results;

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/getStarted', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/', function(req, res) {
        res.redirect('/register'); // load the index.ejs file
    });

    app.get('/home#_=_', function(req, res) {
        res.redirect('/'); // load the index.ejs file
    });


    // =====================================
    // Registration ========================
    // =====================================
    // show the signup form
    app.get('/register', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('registration.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/home', isLoggedIn, function(req, res) {

      const options = {
        method: 'GET',
        uri: `https://graph.facebook.com/v2.8/${req.user.facebook.id}/accounts`,
        qs: {
            access_token: req.user.facebook.token
        }
      };

      if(req.user.instagram.id){


      ig.use({
       access_token : req.user.instagram.token
      });


      ig.user_media_recent((req.user.instagram.token).split('.')[0], function(err, result, pagination, remaining, limit) {
        if(err) res.json(err);
           // pass the json file gotten to our ejs template

           request(options)
           .then(fbRes => {
             res.render('home.ejs', {
                 results: JSON.parse(fbRes),
                 user : req.user,
                 instagram : result,
                 fbtoken: req.user.facebook.token,
                 fbid: req.user.facebook.id
                  // get the user out of session and pass to template
             });
             console.log(result);
           })
          });
        }
        else{
          request(options)
          .then(fbRes => {
            res.render('home.ejs', {
                results: JSON.parse(fbRes),
                user : req.user,
                fbtoken: req.user.facebook.token,
                fbid: req.user.facebook.id
                 // get the user out of session and pass to template
            });
            console.log(JSON.parse(fbRes));
          })
        }

        current = 1;

    });

    app.get('/getStarted', isLoggedIn,function(req, res) {
        res.render('getStarted.ejs', {
          user : req.user
        }); // load the index.ejs file
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/register');
    });

    app.post('/send-email', isLoggedIn, function (req, res) {
          let transporter = nodeMailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587,
              secure: false,
              requireTLS: true,
              auth: {
                  user: 'nevillekitala@gmail.com',
                  pass: 'maryland6987'
              }
          });

          var compiled = ejs.compile(fs.readFileSync('./views/email.ejs', 'utf8'));
          var html = compiled({
              name : req.user.name,
              email : req.user.email,
              password: req.user.password
            });

          let mailOptions = {
              from: 'donotreply@gmail.com', // sender address
              to: req.body.to, // list of receivers
              subject: "Get Started and authenticate your account " + req.body.subject, // Subject line
              text: "Get Started and authenticate your account ", // plain text body
              html:  html// html body
          };

          transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
          console.log(html);
          });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'manage_pages', 'publish_pages', 'read_page_mailboxes', 'pages_show_list', 'pages_messaging'],
    display: 'popup'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/home',
            failureRedirect : '/signup'
        }));

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
        successRedirect : '/home',
        failureRedirect : '/signup'
      }));

      // =====================================
   // GOOGLE ROUTES =======================
   // =====================================
   // send to google to do the authentication
   // profile gets us their basic information including their name
   // email gets their emails
   app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

   // the callback after google has authenticated the user
   app.get('/auth/google/callback',
     passport.authenticate('google', {
       successRedirect : '/home',
       failureRedirect : '/signup'
     }));

   app.get('/auth/instagram', passport.authenticate('instagram', { scope: [
      'basic',
      'public_content'
    ]}));

   // the callback after instagram has authenticated the user
   app.get('/auth/instagram/callback',
      passport.authenticate('instagram', { failureRedirect: '/login' }),
      function(req, res) {
      res.redirect('/home');
    });

   app.get('/auth/pinterest', passport.authenticate('pinterest', { scope: [
      'read_public',
      'write_public',
      'read_relationships',
      'write_relationships'
    ] }));

   // the callback after instagram has authenticated the user
   app.get('/auth/pinterest/callback',
     passport.authenticate('pinterest', {
       successRedirect : '/home',
       failureRedirect : '/signup'
     }));

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};
