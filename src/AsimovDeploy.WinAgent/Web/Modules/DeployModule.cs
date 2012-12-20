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

using System.Collections.Generic;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Web.Commands;
using Nancy;
using Nancy.ModelBinding;
using log4net;

namespace AsimovDeploy.WinAgent.Web.Modules
{
    public class DeployModule : NancyModule
    {
        private readonly ITaskExecutor _taskExecutor;
        private static ILog Log = LogManager.GetLogger(typeof (DeployModule));

        public DeployModule(ITaskExecutor taskExecutor, IAsimovConfig config)
        {
            _taskExecutor = taskExecutor;

            Post["/deploy/deploy"] = _ =>
            {
                var command = this.Bind<DeployCommand>();
                var deployUnit = config.GetUnitByName(command.unitName);

                var packageSource = config.GetPackageSourceFor(deployUnit);
                var version = packageSource.GetVersion(command.versionId, deployUnit.PackageInfo);
                var deployTask = deployUnit.GetDeployTask(version, new ParameterValues(command.parameters));

                _taskExecutor.AddTask(deployTask);

                return "OK";
            };

            Post["/deploy/verify"] = _ =>
            {
                var command =  this.Bind<VerifyCommand>();
                var deployUnit = config.GetUnitByName(command.unitName);
                var verifyTask = deployUnit.GetVerifyTask();

                _taskExecutor.AddTask(verifyTask);

                return "OK";
            };
        }
    }
}