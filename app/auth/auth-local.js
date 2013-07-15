
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var config = require('../config');
var _ = require('underscore');

var users = config.users;

if (!users) {
	throw new Error("Missing users config section, needed by local authentication mode!");
}

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	var user = _.find(users, function(user) { return user.username === username; });
	done(null, user);
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		var user = _.find(users, function(user) { return user.username === username; });
		if (!user || user.password !== password) {
			return done(null, false, { message: ' Unkown username or password' });
		}
		return done(null, user);
	})
);

function ensureLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.statusCode = 401;
	res.json({ error: "Unauthorized" });
}

module.exports = {
	addAuthMiddleware: function(app) {
		app.use(passport.initialize());
		app.use(passport.session());

		app.ensureLoggedIn = ensureLoggedIn;
	},
	authenticate: function(callback) {
		return passport.authenticate('local', callback);
	}
};