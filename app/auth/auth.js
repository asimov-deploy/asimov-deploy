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

function initAuth(app, passport, config) {
	if (config['auth-local']) {
		require('./auth-local')(app, passport, config);
	}

	if (config['auth-google']) {
		if (config['auth-google'].clientID) {
			require('./auth-google-oauth2')(app, passport, config);
		} else {
			console.warn('OpenID2 for Google accounts is going away on April 20, 2015');
			console.warn(
				'To continue using Google auth after that date, ' +
				'go to https://console.developers.google.com to configure OAuth 2.0 credentials and enable the Google+ API, ' +
				'then add ClientID, clientSecret and callbackURL to your asimov google-auth config.'
			);
			require('./auth-google')(app, passport, config);
		}
	}

	if (config['auth-google-iap']) {
		require('./auth-google-iap')(app, passport, config);
	}
}

function initEnsureLoggedIn(app, passport, config) {
	if (config['auth-anonymous']) {
		app.ensureLoggedIn = function (req, res, next) {
			next();
		};
	} else {
		app.ensureLoggedIn = function (req, res, next) {
			if (req.isAuthenticated()) {
				return next();
			}
			res.statusCode = 401;
			res.json({
				error: "Unauthorized"
			});
		};
	}
}

module.exports = function (app, config) {
	var passport = require('passport');

	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user, done) {
		done(null, user);
	});

	initAuth(app, passport, config);
	initEnsureLoggedIn(app, passport, config);


};