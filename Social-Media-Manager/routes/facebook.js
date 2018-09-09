var request = require('request-promise');

var configAuth = require('../config/auth');
var configAuth = require('../models/fbpages');

module.exports = function(app, passport) {

  // you'll need to have requested 'user_about_me' permissions
  // in order to get 'quotes' and 'about' fields from search
  const userFieldSet = 'name, link, picture, created_time, message, story, id';
  const pageFieldSet = 'name, category, link, picture, is_verified';

  var results;

//Get user Feed
  app.get('/facebook/accounts', isLoggedIn, (req, res) => {

  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.8/${req.user.facebook.id}/accounts`,
    qs: {
        access_token: req.user.facebook.token
    }
  };

  request(options)
  .then(fbRes => {
    res.render('facebook.ejs', {
        results: JSON.parse(fbRes),
        user : req.user
         // get the user out of session and pass to template
    });
    console.log(JSON.parse(fbRes));
  })
});

app.post('/facebook_feed', isLoggedIn, (req, res) => {

const options = {
  method: 'GET',
  uri: `https://graph.facebook.com/v2.8/${req.body.account_id}/feed`,
  qs: {
      access_token: req.user.facebook.token,
      fields      : userFieldSet
  }
};

request(options)
.then(fbRes => {
  res.render('facebookdash.ejs', {
      results: JSON.parse(fbRes),
      user : req.user
       // get the user out of session and pass to template
  });
  console.log(JSON.parse(fbRes));
})
});

app.post('/facebook_post', isLoggedIn, (req, res) => {

  const postTextOptions = {
    method: 'POST',
    uri: `https://graph.facebook.com/v2.8/${req.body.id}/feed`,
    qs: {
      access_token: req.body.token,
      message: req.body.to
    }
  };
  request(postTextOptions);
  res.redirect('/facebook_feed');
});

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};
