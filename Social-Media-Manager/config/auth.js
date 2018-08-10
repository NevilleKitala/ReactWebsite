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
        'clientID'      : '287345927343-9mbboinsc8skdt7sa1l306f4pti22mq6.apps.googleusercontent.com',
        'clientSecret'  : 'AnDKrfrc49ccGxm_eRZ2Vhrx',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    },

    'instagramAuth' : {
        'clientID'      : '15fa9aceeafb402882545c1dd427acf5',
        'clientSecret'  : '56175ac4fb7d4541bd4479f043d51d7b',
        'callbackURL'   : 'https://localhost:3000/auth/instagram/callback'
    },

    'pinterestAuth' : {
        'clientID'      : '4981429134203824452',
        'clientSecret'  : '5c16fe734da1bcf0abf2446e9922b07802e0dc3220b02aa0211e84804eb22473',
        'callbackURL'   : 'https://localhost:3000/auth/pinterest/callback'
    }


};
