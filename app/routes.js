var data = require('./data.js');

module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    // View All Children
	var orphan_list_fields = ['name', 'sex__c', 'orphan_status__c', 'category__c', 'extended_family__c'];
    app.get('/children', isLoggedIn, function(req, res) {
		// TODO: There should be a way to do this in 1 query
		data.RecordType.findOne({attributes: ['sfid'], where: {'developername': 'Child', 'sobjecttype': 'Contact'}}).then(function(childRecordType) {
	        data.Contact.findAll({
				attributes: orphan_list_fields,
				where: {
					'recordtypeid': childRecordType.sfid
				}
			}).then(function(contacts) {
				res.render('children.ejs', {
					contacts: contacts
				});
	        });
		});
    });

	// View the children I'm sponsoring
	var sponsorship_list_fields = ['contact.name', 'sponsorship.begin_date__c', 'sponsorship.end_date__c', 'sponsorship.sponsorship_amount__c'];
	app.get('/sponsorship', isLoggedIn, function(req, res) {
		data.Utils.getSponsoredChildrenForUser(req.user, sponsorship_list_fields).then(function(sponsored) {
			console.log("Rendering sponsored children: " + JSON.stringify(sponsored));
			res.render('generic_object.ejs', {
				data: sponsored,
				pageTitle: "My Sponsored Children"
			});
		});
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				failureRedirect : '/'
			}),
			function(req, res) {
     			res.cookie('signIn', 'true');
      			res.redirect('/profile');
    		});

	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
