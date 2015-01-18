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
	var url = require('url');
	var GoogleStrategy = require('passport-google-oauth2');
	var emails = config['auth-google'].emails;
	var clientID = config['auth-google'].clientID;
	var clientSecret = config['auth-google'].clientSecret;
	var callbackURL = config['auth-google'].callbackURL;
	var callbackPath = url.parse(callbackURL).path;

	if (!emails || emails.length === 0) {
		throw new Error('Missing allowed emails array in google auth config');
	}

	if(!clientSecret){
		throw new Error('Missing clientSecret in google auth config');
	}

	if(!callbackURL){
		throw new Error('Missing callbackURL in google auth config');
	}

	var strategy = new GoogleStrategy({
	    clientID: clientID,
	    clientSecret: clientSecret,
	    callbackURL: callbackURL,
	    scope: 'email'
	},

		function(accessToken, refreshToken, profile, done) {
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


	passport.use(strategy);

	app.get(callbackPath,passport.authenticate('google', { successRedirect: '/', failureRedirect: '/', failureFlash: true }));

	app.get('/auth/google', function(req, res, next) {
		passport.authenticate('google')(req, res, next);
	});

};
