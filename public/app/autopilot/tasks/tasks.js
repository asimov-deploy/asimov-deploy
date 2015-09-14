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

/* jshint -W074 */

define([
    "require",
    "when/sequence",
    "./DisableLoadbalancerForAgents",
    "./EnableLoadbalancerForAgents",
    "./Deploy",
    "./Prompt",
    "./Verify",
    "./CheckVerifyResult",
    "./DeployAndCheckVerifyResult",
    "./VerifyAndCheckResult"
],
function(require, sequence) {
    var _getTask = function (taskName) {
        return require('./' + taskName);
    };

    var tasks = {
        createTask: function (data) {
            return function() {
                var tasks = [];
                var task = _getTask(data.name);
                tasks.push(task.execute(data));
                return sequence(tasks);
            };
        },
        getTaskInformation: function (taskName) {
            var task = _getTask(taskName);
            return task.getInfo();
        }
    };

    return tasks;
});
