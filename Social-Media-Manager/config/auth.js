// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '182924785910131', // your App ID
        'clientSecret'  : '46eb659408a5aa7b07799c11d98cdcbd', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'twitterAuth' : {
        'consumerKey'       : 'Ch4HIvt0ld3WzeyTheD7iTq5H',
        'consumerSecret'    : '5Ff5kq9DuA3PR3aUjQOokLAy9b5ZRnyIgdi6xfX2ShbHjiBLjx',
        'callbackURL'       : 'https://127.0.0.1:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};
