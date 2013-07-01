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

var express = require('express');
var restify = require("restify");
var io = require('socket.io');
var path = require('path');
var http = require('http');
var _ = require('underscore');

var config = require('./app/config');

var app = express();
var server = http.createServer(app);
var secure = express.basicAuth(config.username, config.password);

app.configure(function(){
  app.set('port', config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/img/logo.png'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

app.use("/app", express["static"]( __dirname + '/public/app' ));

app.use("/css", express["static"]( __dirname + '/dist/release' ));
app.use("/css", express["static"]( __dirname + '/dist/debug' ));

app.use("/img", express["static"]( __dirname + '/public/img' ));

app.use("/libs", express["static"]( __dirname + '/dist/release' ));
app.use("/libs", express["static"]( __dirname + '/dist/debug' ));
app.use("/libs", express["static"]( __dirname + '/public/libs' ));

if (config.demo) {
	var demo = require('./app/demo')(app);
}

require("./app/agents")(app, secure);
require("./app/deploy")(app, secure);
require("./app/loadbalancer")(app, secure);
require("./app/units")(app, secure);
require("./app/versions")(app, secure);

app.get('/', secure, function(req, res) {

   var agents = _.where(config.agents, {dead: false});
   agents = _.pluck(agents, ["name"]);

	var viewModel = {
		hostName: req.headers.host.replace(/:\d+/, ''),
		version: config.version,
		port: config.port,
		instances: config.instances,
		instanceName: config.name,
      agents: agents
	};

  res.render('index', viewModel);
});


var server = http.createServer(app);

var startServer = function() {
	server.listen(config.port);
};

startServer();

server.on("error", function(err) {
	if (err.code == 'EADDRINUSE')	{
		if (config.nextInstance())	{
			startServer();
		}
	}
});

server.on("listening", function() {
	console.log("Instance name: " + config.name + " Port: " + config.port);

	io = io.listen(server);

	if (config.demo) {
		io.configure(function () {
			io.set('transports', ['xhr-polling']);
			io.set('close timeout', 40);
			io.set('heartbeat timeout', 30);
			io.set('heartbeat interval', 35);
			io.set("polling duration", 40);
		});
	}

	io.sockets.on('connection', function(socket) { });
	io.sockets.on('error', function (exc) {
		console.log("socket io exception: " + exc);
	});

	GLOBAL.clientSockets = io;
});

process.on('uncaughtException', function (err) {
  console.log('Caught process exception: ' + err);
});


