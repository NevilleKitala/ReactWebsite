var request = require('request-promise');

var configAuth = require('../config/auth');
var configAuth = require('../models/fbpages');

module.exports = function(app, passport) {

  // you'll need to have requested 'user_about_me' permissions
  // in order to get 'quotes' and 'about' fields from search
  const userFieldSet = 'name, link, picture, created_time, message, story, id';
  const pageFieldSet = 'name, message, story, comments{comments{attachments,from,id,message,created_time},from,id,message,created_time}, category, link, picture, is_verified, attachments, created_time';

  var results;

app.post('/facebook/feed', isLoggedIn, (req, res) => {

    if(req.body.message != null){
    const postTextOptions = {
      method: 'POST',
      uri: `https://graph.facebook.com/v2.8/${req.body.comment_id}/comments`,
      qs: {
        access_token: req.body.access_token,
        message: req.body.message
      }
    };

    request(postTextOptions);
  }

  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.8/${req.body.account_id}/feed`,
    qs: {
        access_token: req.body.access_token,
        fields: pageFieldSet
    }
  };

    request(options)
    .then(fbRes => {

      res.render('fbAccountFeed.ejs', {
          results: JSON.parse(fbRes),
          user : req.user,
          account_id: req.body.account_id,
          token : req.body.access_token,
          fbRes : fbRes
           // get the user out of session and pass to template
      });

      console.log((JSON.parse(fbRes)).data);
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
