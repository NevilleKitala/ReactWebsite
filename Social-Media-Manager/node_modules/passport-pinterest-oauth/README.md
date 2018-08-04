# Passport-Pinterest-OAuth

[Passport](http://passportjs.org/) strategies for authenticating with [Pinterest](http://www.pinterest.com/)
using OAuth 1.0a and OAuth 2.0.

This module lets you authenticate using Pinterest in your Node.js applications.
By plugging into Passport, Pinterest authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

The client id and client secret needed to authenticate with Pinterest can be set up from the developer's console [Pinterest Developer's Console](https://developers.pinterest.com).

## Install

    $ npm install passport-pinterest-oauth


## Usage of OAuth 2.0

#### Configure Strategy

The Pinterest OAuth 2.0 authentication strategy authenticates users using a Pinterest
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

```Javascript
var PinterestStrategy = require('passport-pinterest-oauth').OAuth2Strategy;

passport.use(new PinterestStrategy({
    clientID: PINTEREST_CLIENT_ID,
    clientSecret: PINTEREST_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/pinterest/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ pinterestId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'pinterest'` strategy, to
authenticate requests.
Authentication with Pinterest requires an extra scope parameter.  For information, go [here](https://developers.pinterest.com).

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```Javascript
app.get('/auth/pinterest',
  passport.authenticate('pinterest', { scope: [
      'read_pubic',
      'write_public',
      'read_relationships',
      'write_relationships'
    ] }));

app.get('/auth/pinterest/callback', 
  passport.authenticate('pinterest', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Examples

For a complete, working example, refer to the [OAuth 1.0 example](https://github.com/jaredhanson/passport-google-oauth/tree/master/examples/oauth)
and the [OAuth 2.0 example](https://github.com/jaredhanson/passport-google-oauth/tree/master/examples/oauth2) as they are simillar to pinterest auth.

## Tests

    $ npm install --dev
    $ make test


## Credits
  - [Rubin Apore](http://github.com/4barz)
  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>