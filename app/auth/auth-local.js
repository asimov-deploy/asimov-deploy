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

	var LocalStrategy = require('passport-local').Strategy;
	var _ = require('underscore');

	var users = config.authLocal.users;

	if (!users) {
		throw new Error("Missing users config section, needed by local authentication mode!");
	}

	function localLogin(username, password, done) {
		var user = _.find(users, function(user) { return user.name === username; });

		if (!user || user.password !== password) {
			return done(null, false, { message: ' Unkown username or password' });
		}

		return done(null, {
			name: user.name,
			id: user.name
		});
	}

	passport.use(new LocalStrategy(localLogin));

	app.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (!user) {
				return res.send({ status:'err', message: info.message });
			}

			req.login(user, function(err) {
				if (err) { return res.send({ status: 'err', message: err.message }); }

				return res.send({ status: 'ok', user: { name: user.name } });
			});

		})(req, res, next);
	});

};


