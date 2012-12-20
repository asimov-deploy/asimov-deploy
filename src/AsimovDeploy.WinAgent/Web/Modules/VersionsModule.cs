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

using System.Linq;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Web.Contracts;
using Nancy;

namespace AsimovDeploy.WinAgent.Web.Modules
{
    public class VersionsModule : NancyModule
    {
        public VersionsModule(IAsimovConfig config)
        {
            Get["/versions/{unitName}"] = parameters =>
                {
                    var unitName = (string) parameters.unitName;
                    var deployUnit = config.GetUnitByName(unitName);
                    var versions = config.GetPackageSourceFor(deployUnit)
                            .GetAvailableVersions(deployUnit.PackageInfo)
                            .Select(x =>
                                new DeployUnitVersionDTO()
                                {
                                    id = x.Id,
                                    timestamp = x.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"),
                                    version = x.Number,
                                    branch = x.Branch,
                                    commit = x.Commit
                                });

                    return Response.AsJson(versions);
            };
        }
    }
}