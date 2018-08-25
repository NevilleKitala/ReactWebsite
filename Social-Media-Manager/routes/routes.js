// routes.js
var nodeMailer = require("nodemailer");

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });


    // =====================================
    // Registration ========================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

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
        res.render('home.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/email', isLoggedIn,function(req, res) {
        res.render('emailsender.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
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
          let mailOptions = {
              from: 'donotreply@gmail.com', // sender address
              to: req.body.to, // list of receivers
              subject: req.body.subject, // Subject line
              text: req.body.body, // plain text body
              html: '<b>NodeJS Email Tutorial</b>' // html body
          };

          transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('index');
          });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'manage_pages']
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