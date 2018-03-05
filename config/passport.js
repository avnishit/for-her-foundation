// config/passport.js

// load all the things we need
//var LocalStrategy    = require('passport-local').Strategy;
//var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport,app) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {

        console.log("serialize"+user);

        done(null, user._id);
    });
    // used to deserialize the user
   passport.deserializeUser(function(id, done) {

        console.log("deserialize:"+id);
      User.findById(id, function(err, user) {
      done(err, user);
       });
    }); 
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))


	 passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
	   profileFields	: ['id', 'emails', 'name'] //This

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findById(profile.emails[0].value.toString().toLowerCase(), function(err, user) {

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
                    newUser._id   = profile.emails[0].value; // set the users facebook id                   
                    //newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    //newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google

        //console.log("User Profile: "+profile );
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findById(profile.emails[0].value.toString().toLowerCase(), function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    // if a user is found, log them in
                    console.log("Found:"+user);
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser._id    = profile.id;
                    //newUser.google.token = token;
                    newUser.name  = profile.displayName;
                    //newUser.google.email = profile.emails[0].value; // pull the first email

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

};

