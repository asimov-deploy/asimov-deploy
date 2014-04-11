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

module.exports = function(app, passport, config) {

	var _ = require('underscore');
	var GoogleStrategy = require('passport-google').Strategy;

	var emails = config['auth-google'].emails;

	if (!emails || emails.length === 0) {
		throw new Error('Missing allowed emails array in google auth config');
	}

	var strategy = new GoogleStrategy({ returnURL: 'dummy' },
		function(identifier, profile, done) {
			var email = profile.emails[0].value;

			if (_.indexOf(emails, email) === -1) {
				done(null, false, { message: "User " + email + " does not have access rights to use Asimov Deploy" });
				return;
			}

			done(null, {
				name: profile.displayName,
				email: email,
				id: email
			});
		}
	);

	function changeReturnUrlHack(req) {
		var hostName = req.headers.host;
		var baseUrl = "http://" + hostName;
		strategy._relyingParty.realm = baseUrl;
		strategy._relyingParty.returnUrl = baseUrl + "/auth/google/return";
	}

	passport.use(strategy);

	app.get('/auth/google/return',passport.authenticate('google', { successRedirect: '/', failureRedirect: '/', failureFlash: true }));

	app.get('/auth/google', function(req, res, next) {
		changeReturnUrlHack(req);
		passport.authenticate('google')(req, res, next);
	});

};