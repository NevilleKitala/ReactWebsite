var ig = require('instagram-node').instagram();

module.exports = function(app, passport) {

  app.get('/instagram_feed', isLoggedIn, (req, res) => {
     // create a new instance of the use method which contains the access token gotten
      ig.use({
       access_token : req.user.instagram.token
      });

      ig.user_media_recent((req.user.instagram.token).split('.')[0], function(err, result, pagination, remaining, limit) {
          if(err) res.json(err);
       // pass the json file gotten to our ejs template
          res.render('instagram.ejs', { instagram : result });
          console.log(result);
      });
  });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};
