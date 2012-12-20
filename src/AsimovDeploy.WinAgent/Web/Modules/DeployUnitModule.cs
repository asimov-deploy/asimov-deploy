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

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Web.Contracts;
using Nancy;

namespace AsimovDeploy.WinAgent.Web.Modules
{
    public class DeployUnitModule : NancyModule
    {
        public DeployUnitModule(IAsimovConfig config)
        {
            Get["/units/list"] = _ =>
            {
                var units = new List<DeployUnitInfoDTO>();

                foreach (var deployUnit in config.Units)
                {
                    var unitInfo = deployUnit.GetUnitInfo();
                    var unitInfoDto = new DeployUnitInfoDTO();
                    unitInfoDto.name = unitInfo.Name;
                    unitInfoDto.info = unitInfo.Info;

                    if (unitInfo.DeployStatus != DeployStatus.NA)
                    {
                        unitInfoDto.status = unitInfo.DeployStatus.ToString();
                        unitInfoDto.info = "";
                    }
                    else
                        unitInfoDto.status = unitInfo.Status.ToString();

                    unitInfoDto.url = unitInfo.Url;
                    unitInfoDto.version = unitInfo.Version.VersionNumber;
                    unitInfoDto.branch = unitInfo.Version.VersionBranch;
                    unitInfoDto.hasDeployParameters = unitInfo.HasDeployParameters;

                    units.Add(unitInfoDto);
                }

                return Response.AsJson(units);
            };

            Get["/units/deploy-parameters/{unitName}"] = urlArgs =>
            {
                var deployUnit = config.GetUnitByName((string)urlArgs.unitName);
                if (deployUnit == null)
                    return 404;

                var parameters = new List<dynamic>();
                foreach (var deployParameter in deployUnit.DeployParameters)
                    parameters.Add(deployParameter.GetDescriptor());

                return Response.AsJson(parameters);
            };
        }
    }
}