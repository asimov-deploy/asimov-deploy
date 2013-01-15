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
var socketio = require( 'socket.io' );
var restify = require("restify");
var path = require('path');
var http = require('http');
var _ = require('underscore');
var app = express();

app.configure(function(){
  app.set('port', 3333);
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

app.use("/css", express["static"]( __dirname + '/public/css' ));
app.use("/img", express["static"]( __dirname + '/public/img' ));

app.use("/libs", express["static"]( __dirname + '/dist/release' ));
app.use("/libs", express["static"]( __dirname + '/dist/debug' ));
app.use("/libs", express["static"]( __dirname + '/public/libs' ));


var config = require('./app/config');
var machine_config = require("./app/machine_config");
var secure = express.basicAuth(config.username, config.password);

require("./app/agents")(app, secure);
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
		instances: machine_config.instances,
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
	if (err.code == 'EADDRINUSE')
	{
		if (config.nextInstance())
		{
			startServer();
		}
	}
});

server.on("listening", function() {
	console.log("Instance name: " + config.name + " Port: ");

	GLOBAL.clientSockets = socketio.listen(server);
	GLOBAL.clientSockets.sockets.on('connection', function(socket) { });
});

