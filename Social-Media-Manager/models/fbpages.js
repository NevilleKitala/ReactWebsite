// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var fbpageSchema = mongoose.Schema({

    page            : {
        userid       : String,
        token        : String,
        category     : String,
        pageid       : String,
        name         : String
    }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('FBPage', fbpageSchema);
