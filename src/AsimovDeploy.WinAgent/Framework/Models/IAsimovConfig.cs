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
using AsimovDeploy.WinAgent.Framework.LoadBalancers;
using AsimovDeploy.WinAgent.Framework.Models.PackageSources;
using AsimovDeploy.WinAgent.Framework.Models.Units;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public interface IAsimovConfig
    {
        string Environment { get; }
        int HeartbeatIntervalSeconds { get; }
        string TempFolder { get; }
        string NodeFrontUrl { get;}
        int WebPort { get; }
        string ApiKey { get; set; }
        int LoadBalancerId { get; }
        int ConfigVersion { get; }

        DeployUnits Units { get; }

        DeployUnit GetUnitByName(string name);

        LoadBalancerSettings LoadBalancer { get; }

        Uri WebControlUrl { get; }

        PackageSource GetPackageSourceFor(DeployUnit deployUnit);
    }
}