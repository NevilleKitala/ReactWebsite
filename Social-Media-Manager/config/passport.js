// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var PinterestStrategy = require('passport-pinterest-oauth').OAuth2Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
var request = require('request-promise');

// load up the user model
var User            = require('../models/user');
var FBPage          = require('../models/fbpages');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        var name = req.body.name;

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.name     = name;
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));

    // =========================================================================
       // LOCAL LOGIN =============================================================
       // =========================================================================
       // we are using named strategies since we have one for login and one for signup
       // by default, if there was no name, it would just be called 'local'

       passport.use('local-login', new LocalStrategy({
           // by default, local strategy uses username and password, we will override with email
           usernameField : 'email',
           passwordField : 'password',
           passReqToCallback : true // allows us to pass back the entire request to the callback
       },
       function(req, email, password, done) { // callback with email and password from our form

           // find a user whose email is the same as the forms email
           // we are checking to see if the user trying to login already exists
           User.findOne({ 'local.email' :  email }, function(err, user) {
               // if there are any errors, return the error before anything else
               if (err)
                   return done(err);

               // if no user is found, return the message
               if (!user)
                   return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

               // if the user is found but the password is wrong
               if (!user.validPassword(password))
                   return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

               // all is well, return successful user
               return done(null, user);
           });

       }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : configAuth.facebookAuth.profileFields,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

   },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.email; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session
                const pageFieldSet = 'name, category, link, picture, is_verified';

                // update the current users facebook credentials
                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.email;

                const options = {
                  method: 'GET',
                  uri: `https://graph.facebook.com/v2.8/${profile.id}/accounts`,
                  qs: {
                      access_token: token
                  }
                };

                request(options)
                .then(fbRes => {
                  (JSON.parse(fbRes)).data.forEach(elem => {
                    FBPage.findOne({ 'pageid' : elem.id.id }, function(err, page) {
                      if(page){

                      }else{
                        var fbpage = new FBPage();

                        fbpage.page.userid = user.local.id;
                        fbpage.page.token = elem.access_token;
                        fbpage.page.category = elem.category;
                        fbpage.page.pageid = elem.id;
                        fbpage.page.name = elem.name;

                        fbpage.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });
                      }
                    });
                  });

                  console.log(JSON.parse(fbRes));
                });

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });

    }));

    // =========================================================================
    // TWITTER SIGNUP ============================================================
    // =========================================================================

    passport.use(new TwitterStrategy({

       consumerKey     : configAuth.twitterAuth.consumerKey,
       consumerSecret  : configAuth.twitterAuth.consumerSecret,
       callbackURL     : configAuth.twitterAuth.callbackURL,
       passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

   },
   function(req, token, refreshToken, profile, done) {

       // asynchronous
       process.nextTick(function() {

           // check if the user is already logged in
           if (!req.user) {

               // find the user in the database based on their facebook id
               User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                   // if there is an error, stop everything and return that
                   // ie an error connecting to the database
                   if (err)
                       return done(err);

                   // if the user is found, then log them in
                   if (user) {
                       return done(null, user); // user found, return that user
                   } else {
                       // if there is no user found with that facebook id, create them
                       var newUser            = new User();

                       // set all of the facebook information in our user model
                       newUser.twitter.id          = profile.id;
                       newUser.twitter.token       = token;
                       newUser.twitter.username    = profile.username;
                       newUser.twitter.displayName = profile.displayName;

                       // save our user to the database
                       newUser.save(function(err) {
                           if (err)
                               throw err;

                           // if successful, return the new user
                           return done(null, newUser);
                       });
                   }

               });

           } else {
               // user already exists and is logged in, we have to link accounts
               var user            = req.user; // pull the user out of the session

               // update the current users facebook credentials
               user.twitter.id    = profile.id;
               user.twitter.token = token;
               user.twitter.name  = profile.username;
               user.twitter.email = profile.displayName;

               // save the user
               user.save(function(err) {
                   if (err)
                       throw err;
                   return done(null, user);
               });
           }

       });

   }));

   // =========================================================================
   // INSTAGRAM SIGNUP ============================================================
   // =========================================================================

   passport.use( new InstagramStrategy({
     clientID        : configAuth.instagramAuth.clientID,
     clientSecret    : configAuth.instagramAuth.clientSecret,
     callbackURL     : configAuth.instagramAuth.callbackURL,
     passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
   },
   function(req, token, refreshToken, profile, done) {

       // asynchronous
       process.nextTick(function() {

           // check if the user is already logged in
           if (!req.user) {

               // find the user in the database based on their facebook id
               User.findOne({ 'instagram.id' : profile.id }, function(err, user) {

                   // if there is an error, stop everything and return that
                   // ie an error connecting to the database
                   if (err)
                       return done(err);

                   // if the user is found, then log them in
                   if (user) {
                       return done(null, user); // user found, return that user
                   } else {
                       // if there is no user found with that facebook id, create them
                       var newUser            = new User();

                       // set all of the facebook information in our user model
                       newUser.instagram.id          = profile.id;
                       newUser.instagram.token       = token;
                       newUser.instagram.username    = profile.username;
                       newUser.instagram.displayName = profile.displayName;

                       // save our user to the database
                       newUser.save(function(err) {
                           if (err)
                               throw err;

                           // if successful, return the new user
                           return done(null, newUser);
                       });
                   }

               });

           } else {
               // user already exists and is logged in, we have to link accounts
               var user            = req.user; // pull the user out of the session

               // update the current users facebook credentials
               user.instagram.id    = profile.id;
               user.instagram.token = token;
               user.instagram.name  = profile.username;
               user.instagram.email = profile.displayName;

               // save the user
               user.save(function(err) {
                   if (err)
                       throw err;
                   return done(null, user);
               });
           }

       });

   }));


   // =========================================================================
   // GOOGLE ==================================================================
   // =========================================================================
   passport.use(new GoogleStrategy({

       clientID        : configAuth.googleAuth.clientID,
       clientSecret    : configAuth.googleAuth.clientSecret,
       callbackURL     : configAuth.googleAuth.callbackURL,
       passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

   },
   function(req, token, refreshToken, profile, done) {

       // asynchronous
       process.nextTick(function() {

           // check if the user is already logged in
           if (!req.user) {

               // find the user in the database based on their facebook id
               User.findOne({ 'google.id' : profile.id }, function(err, user) {

                   // if there is an error, stop everything and return that
                   // ie an error connecting to the database
                   if (err)
                       return done(err);

                   // if the user is found, then log them in
                   if (user) {
                       return done(null, user); // user found, return that user
                   } else {
                       // if there is no user found with that facebook id, create them
                       var newUser            = new User();

                       // set all of the facebook information in our user model
                       newUser.google.id    = profile.id;
                       newUser.google.token = token;
                       newUser.google.name  = profile.displayName;
                       newUser.google.email = profile.emails[0].value; // pull the first email

                       // save our user to the database
                       newUser.save(function(err) {
                           if (err)
                               throw err;

                           // if successful, return the new user
                           return done(null, newUser);
                       });
                   }

               });

           } else {
               // user already exists and is logged in, we have to link accounts
               var user            = req.user; // pull the user out of the session

               // update the current users facebook credentials
               user.google.id    = profile.id;
               user.google.token = token;
               user.google.name  = profile.displayName;
               user.google.email = profile.emails[0].value; // pull the first email

               // save the user
               user.save(function(err) {
                   if (err)
                       throw err;
                   return done(null, user);
               });
           }

       });

   }));

   // =========================================================================
   // Pinterest ==================================================================
   // =========================================================================

   passport.use(new PinterestStrategy({

       clientID        : configAuth.pinterestAuth.clientID,
       clientSecret    : configAuth.pinterestAuth.clientSecret,
       callbackURL     : configAuth.pinterestAuth.callbackURL,
       passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

   },
   function(req, token, refreshToken, profile, done) {

       // asynchronous
       process.nextTick(function() {

           // check if the user is already logged in
           if (!req.user) {

               // find the user in the database based on their facebook id
               User.findOne({ 'pinterest.id' : profile.id }, function(err, user) {

                   // if there is an error, stop everything and return that
                   // ie an error connecting to the database
                   if (err)
                       return done(err);

                   // if the user is found, then log them in
                   if (user) {
                       return done(null, user); // user found, return that user
                   } else {
                       // if there is no user found with that facebook id, create them
                       var newUser            = new User();

                       // set all of the facebook information in our user model
                       newUser.pinterest.id          = profile.id;
                       newUser.pinterest.token       = token;
                       newUser.pinterest.name        = profile.displayName;
                       newUser.pinterest.email       = profile.email;

                       // save our user to the database
                       newUser.save(function(err) {
                           if (err)
                               throw err;

                           // if successful, return the new user
                           return done(null, newUser);
                       });
                   }

               });

           } else {
               // user already exists and is logged in, we have to link accounts
               var user            = req.user; // pull the user out of the session

               // update the current users facebook credentials
               user.pinterest.id    = profile.id;
               user.pinterest.token = token;
               user.pinterest.name  = profile.displayName;
               user.pinterest.email = profile.email;

               // save the user
               user.save(function(err) {
                   if (err)
                       throw err;
                   return done(null, user);
               });
           }

       });

   }));


};
