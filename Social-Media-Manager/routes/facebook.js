var request = require('request-promise');

module.exports = function(app, passport) {

  // you'll need to have requested 'user_about_me' permissions
  // in order to get 'quotes' and 'about' fields from search
  const userFieldSet = 'name, link, is_verified, picture';
  const pageFieldSet = 'name, category, link, picture, is_verified';

//Get user Feed
  app.get('/facebook/feed', isLoggedIn, (req, res) => {
  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.8/${req.user.facebook.id}/feed`,
    qs: {
        access_token: req.user.facebook.token
    }
  };
  request(options)
  .then(fbRes => {
    res.json(fbRes);
  })
});

//get user account information
//Get user Feed
  app.get('/facebook/account', isLoggedIn, (req, res) => {
  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.8/${req.user.facebook.id}/accounts`,
    qs: {
        access_token: req.user.facebook.token
    }
  };
  request(options)
  .then(fbRes => {
    res.json(fbRes);
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
