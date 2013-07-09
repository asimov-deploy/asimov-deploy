/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

//var config = require('./config');

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

function ensureAuth(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.statusCode = 401;
	res.json({ error: "Unauthorized" });
}

module.exports = {
	passport: passport,
	ensureAuth: ensureAuth
};