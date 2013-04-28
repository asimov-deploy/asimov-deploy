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

module.exports = function(server) {
	var fs = require('fs');

	var agentPath = "update/agent/";
	var configPath = "update/config/";

	server.get("/update/agent/", function(req, res) {
		latestAgentFile(function(file, version) {
			res.json({ file: file, version: version  });
		});
	});

	server.get("/update/agent/:fileName", function(req, res) {
		returnFile(res, agentPath, req.params.fileName);
	});

	server.get("/update/config/", function(req, res) {
		latestConfigFile(function(file, version) {
			res.json({ file: file, version: version });
		});
	});

	server.get("/update/config/:fileName", function(req, res) {
		returnFile(res, configPath, req.params.fileName);
	});

	function returnFile(res, path, file) {
		fs.readFile(path + "/" + file, function(err, data) {
			if(err !== null && err.code === "ENOENT") {
				res.send(404);
				res.json({ error: "file not found"});
				return;
			}
			res.writeHead(200, { "Content-Disposition": "attachment; filename=\"" + file + "\"" });
			res.end(data);
		});
	}

	function latestConfigFile(callback) {
		fs.readdir(configPath, function(err, files) {
			if(err !== null && err.code === "ENOENT") {
				callback(null, null);
				return;
			}
			var regex = /AsimovDeploy.WinAgent.ConfigFiles-Version-(\d+).zip/;

			var latestVersion = 0;

			for(var i=0; i<files.length; i++) {
				var matches = regex.exec(files[i]);
				if(matches === null) {
					continue;
				}

				var version = parseInt(matches[1], 10);
				if(version > latestVersion) {
					latestVersion = version;
				}
			}

			callback("AsimovDeploy.WinAgent.ConfigFiles-Version-" + latestVersion + ".zip", latestVersion);
		});
	}

	function latestAgentFile(callback) {
		fs.readdir(agentPath, function(err, files) {
			if(err !== null && err.code === "ENOENT") {
				callback(null, null);
				return;
			}
			var regex = /v(\d+)\.(\d+)\.(\d+).zip/;

			var latestVersion = { major: 0, minor: 0, build: 0 };

			for(var i=0; i<files.length; i++) {
				var matches = regex.exec(files[i]);
				if(matches === null) {
					continue;
				}

				var fileVersion = { major: parseInt(matches[1], 10), minor: parseInt(matches[2], 10), build: parseInt(matches[3], 10) };
				latestVersion = compareVersions(latestVersion, fileVersion);
			}

			callback("v" + latestVersion.major + "." + latestVersion.minor + "." + latestVersion.build + ".zip", latestVersion.major + "." + latestVersion.minor + "." + latestVersion.build);
		});
	}

	function compareVersions(current, candidate) {
		var part = compareVersionPart(current.major, candidate.major);
		if(part != null) {
			return part;
		}

		part = compareVersionPart(current.minor, candidate.minor);
		if(part != null) {
			return part;
		}

		return compareVersionPart(current.minor, candidate.minor);
	}

	function compareVersionPart(current, candidate) {
		if(current.minor > candidate.minor) {
			return current;
		} else if(current.minor < candidate.minor) {
			return candidate;
		}

		return null;
	}
};

