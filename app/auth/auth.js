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

module.exports = function(app, config) {

	if (config.authNone) {
		app.ensureLoggedIn = function(req, res, next) {
			next();
		};
		return;
	}

	var passport = require('passport');

	app.use(passport.initialize());
	app.use(passport.session());

	app.ensureLoggedIn = function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.statusCode = 401;
		res.json({ error: "Unauthorized" });
	};

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	if (config.authLocal) {
		require('./auth-local')(app, passport, config);
	}

	if (config.authGoogle) {
		require('./auth-google')(app, passport, config);
	}
};

