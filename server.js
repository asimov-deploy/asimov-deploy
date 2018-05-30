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
var favicon = require('express-favicon');
// var logger = require('express-logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var http = require('http');
var app = express();
var flash = require('connect-flash');
var auth = require('./app/auth/auth');
var events = require('events');
var _ = require('underscore');
var AsimovConfig = require('./app/config').Config;

var config = new AsimovConfig();

app.vent = new events.EventEmitter();

app.set('port', config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/img/logo.png'));
// app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(require('express-method-override')());
app.use(cookieSession({
	secret: config['session-secret'],
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000
	}
}));
app.use(flash());
auth(app, config);
// app.use(app.router);
app.use(function (err, req, res, next) {
	if (req.xhr) {
		res.status(500).send({ error: 'Something failed!' });
	} else {
		next(err);
	}
});
app.locals.pretty = true;

app.use('/app', express.static(__dirname + '/public/app'));
app.use('/css', express.static(__dirname + '/dist/release'));
app.use('/css', express.static(__dirname + '/dist/debug'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/libs', express.static(__dirname + '/dist/release'));
app.use('/libs', express.static(__dirname + '/dist/debug'));
app.use('/libs', express.static(__dirname + '/public/libs'));

if (config['enable-demo']) {
	require('./app/demo-mode/demo-mode')(app, config);
}

require('./app/agents')(app, config);
require('./app/deploy')(app, config);
require('./app/deploy-lifecycle')(app, config);
require('./app/loadbalancer')(app, config);
require('./app/units')(app, config);
require('./app/versions')(app, config);
require('./app/index')(app, config);
require('./app/autopilot').create(app, config);

_.each(config.plugins, function (plugin) {
	require(plugin.module)(app, plugin, config);
});

require('./app/start-server')(app, http, config);

process.on('uncaughtException', function (err) {
	console.log('Caught process exception: ' + err);
});
