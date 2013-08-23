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

var io = require('socket.io');

module.exports = function(app, http, config) {

	var server = http.createServer(app);

	var startServer = function() {
		server.listen(config.port);
	};

	startServer();

	server.on("error", function(err) {
		if (err.code === 'EADDRINUSE')	{
			if (config.nextInstance())	{
				startServer();
			}
		}
	});

	server.on("listening", function() {
		console.log("Instance name: " + config.name + " Port: " + config.port);

		io = io.listen(server);

		if (config['enable-demo']) {
			io.configure(function () {
				io.set('transports', ['xhr-polling']);
				io.set('close timeout', 40);
				io.set('heartbeat timeout', 30);
				io.set('heartbeat interval', 35);
				io.set("polling duration", 40);
			});
		}

		io.sockets.on('connection', function() { });
		io.sockets.on('error', function (exc) {
			console.log("socket io exception: " + exc);
		});

		GLOBAL.clientSockets = io;
	});


};