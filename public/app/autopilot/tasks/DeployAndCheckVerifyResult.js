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

define([
    "when/parallel",
    "./Deploy",
    "./Verify"
],
function(parallel, DeployTask, VerifyTask) {
    var DeployAndCheckVerifyResultTask = function (config, eventAggregator) {
        this.execute = function (taskData) {
            return function () {
                var tasks = [];
                tasks.push(new VerifyTask(config, eventAggregator).executeAndSkipInitialVerifyStep(taskData));
                tasks.push(new DeployTask(config, eventAggregator).execute(taskData));

                return parallel(tasks);
            };
        };
    };

    DeployAndCheckVerifyResultTask.getInfo = function () {
        return {
            title: 'Deploy and check verify result',
            description: 'Deploy each unit in set and check result from verify and prompt user if there are failed steps'
        };
    };

    return DeployAndCheckVerifyResultTask;
});
