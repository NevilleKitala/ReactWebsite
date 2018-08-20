var request = require('request-promise');

module.exports = function(app, passport) {

  // you'll need to have requested 'user_about_me' permissions
  // in order to get 'quotes' and 'about' fields from search
  const userFieldSet = 'name, link, picture, created_time, message, story, id';
  const pageFieldSet = 'name, category, link, picture, is_verified';

  var results;

//Get user Feed
  app.get('/facebook_feed', isLoggedIn, (req, res) => {

  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.8/${req.user.facebook.id}/feed`,
    qs: {
        access_token: req.user.facebook.token,
        fields      : userFieldSet
    }
  };

  request(options)
  .then(fbRes => {
    res.render('Main.ejs', {
        results: JSON.parse(fbRes) // get the user out of session and pass to template
    });
  })


});

//get user account information
//Get user Feed
  app.get('/facebook_account', isLoggedIn, (req, res) => {
  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.8/${req.user.facebook.id}/accounts`,
    qs: {
        access_token: req.user.facebook.token
    }
  };
  request(options)
  .then(fbRes => {
    res.render('Main.ejs', {
        results: JSON.parse(fbRes) // get the user out of session and pass to template
    });
  })
});


};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

function notLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (!req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/home');
};
