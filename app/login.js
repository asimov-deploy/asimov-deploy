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

//var config = require('./config.js');
var authentication = require('./authentication');
var passport = authentication.passport;

module.exports = function(server) {

	server.post("/logintest", passport.authenticate('local'), function(req, res) {
		res.json({ id: req.user.id, username: req.user.username });
	});

	server.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (!user) {
				return res.send({ status:'err', message: info.message });
			}

			req.login(user, function(err) {
				if (err) { return res.send({ status: 'err', message: err.message }); }

				return res.send({ status: 'ok', username: user.username });
			});

		})(req, res, next);
	});

	server.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

};