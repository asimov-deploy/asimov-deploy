
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = [
	{ username: 'bob', password: 'secret' },
	{ username: 'joe', password: 'birthday' }
];

function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	findByUsername(username, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		findByUsername(username, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
			if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
			return done(null, user);
		});
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