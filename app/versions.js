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

var querystring = require("querystring");

module.exports = function (app, config) {
    var agentApiClient = require('./services/agent-api-client').create(config);

    app.get('/deploylog/file', app.ensureLoggedIn, function (req, res) {

        var agent = config.getAgent(req.query.agentName);
        var unitName = querystring.escape(req.query.unitName);

        agentApiClient.getDeployLog(
            req.query.agentName,
            req.query.unitName,
            req.query.position,
            function (data) {
                if(data == null){
                    res.status(404).end();
                    return;
                }
                res.type('text').send(data);
            })
    });

};