// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

var db = require('../app/data.js');
var LocalUser = db.LocalUser;

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {



    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        LocalUser.findById(id).then(function(user){
			done(null, user);
		}).catch(function(e){
			done(e, false);
		});
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
			LocalUser.findOne({ where: { local_email: email }})
				.then(function(user) {
                    console.log("Got user: " + JSON.stringify(user));
					if (!user) {
						done(null, false, req.flash('loginMessage', 'Unknown user'));
					} else if (!user.validPassword(password)) {
						done(null, false, req.flash('loginMessage', 'Wrong password'));
					} else {
						console.log("Accepting user...");
						done(null, user);
					}
				})
				.catch(function(e) {
                    console.log(e);
					done(null, false, req.flash('loginMessage',e.name + " " + e.message + " Caught exception: " + JSON.stringify(e)));
				});
	}));


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
		//  Whether we're signing up or connecting an account, we'll need
		//  to know if the email address is in use.

		LocalUser.findOne({ where: { local_email: email }})
			.then(function(existingUser) {

				// check to see if there's already a user with that email
				if (existingUser)
					return done(null, false, req.flash('loginMessage', 'That email is already taken.'));

				//  If we're logged in, we're connecting a new local account.
				if(req.user) {
					var user            = req.user;
					user.local_email    = email;
					user.local_password = LocalUser.generateHash(password);
					user.save().catch(function (err) {
						throw err;
					}).then (function() {
						done(null, user);
					});
				}
				//  We're not logged in, so we're creating a brand new user.
				else {
					// create the user
					var newUser = LocalUser.build ({local_email: email, local_password: LocalUser.generateHash(password)});
					newUser.save().then(function() {done (null, newUser);}).catch(function(err) { done(null, false, req.flash('loginMessage', err));});
				}
			})
			.catch(function (e) {
				done(null, false, req.flash('loginMessage',e.name + " " + e.message));
			})

    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
	var fbStrategy = configAuth.facebookAuth;
    fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(fbStrategy,
    function(req, token, refreshToken, profile, done) {
		  LocalUser.findOrCreate({
			where: {
			  facebook_id: profile.id,
			  facebook_token: token,
			  facebook_name: profile.name.givenName + ' ' + profile.name.familyName,
			  facebook_email: profile.emails[0].value
			}
		  }).spread(function(user) {
			return done(null, user);
		  });
    }));


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },

		function(req, token, refreshToken, profile, done) {
			LocalUser.findOrCreate({
				where: {
					google_id: profile.id,
					google_token: token,
					google_name: profile.displayName,
					google_email: profile.emails[0].value
				}
			}).spread(function(user) {
				return done(null, user);
			});
		}));
};
