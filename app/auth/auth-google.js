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

module.exports = function(app, passport) {

	var GoogleStrategy = require('passport-google').Strategy;

	passport.use(new GoogleStrategy({
			returnURL: 'http://localhost:3333/auth/google/return',
			realm: 'http://localhost:3333/'
		},
		function(identifier, profile, done) {
			console.log('Google: ' + identifier);
			console.log('Google Profile: ', profile);
			done(null, { username: 'hej' });
		})
	);

	passport.serializeUser(function(user, done) {
		done(null, user.username);
	});

	passport.deserializeUser(function(username, done) {
		done(null, { username: username });
	});

	app.get('/auth/google/return',
		passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.get('/auth/google', passport.authenticate('google'));
};