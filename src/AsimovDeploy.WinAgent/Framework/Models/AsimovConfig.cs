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
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.LoadBalancers;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class AsimovConfig : IAsimovConfig
    {
        public string Environment { get; set; }
        public int HeartbeatIntervalSeconds { get; set; }
        public int WebPort { get; set; }
        public string ApiKey { get; set; }
        public int LoadBalancerId { get; set; }
        public int ConfigVersion { get; set; }

        public string TempFolder { get { return Path.Combine(DataFolder, "Temp"); } }
        public string DataFolder { get; set; }

        public string NodeFrontUrl { get; set; }

        public DeployUnits Units { get; set; }

        public LoadBalancerSettings LoadBalancer { get; set; }

        public PackageSourceList PackageSources { get; set; }

        public Uri WebControlUrl
        {
            get { return new Uri(string.Format("http://{0}:{1}", HostNameUtil.GetFullHostName(), WebPort)); }
        }

        public PackageSource GetPackageSourceFor(DeployUnit deployUnit)
        {
            return PackageSources.Single(x => x.Name == deployUnit.PackageInfo.Source);
        }

        public AsimovConfig()
        {
            Units = new DeployUnits();
        }

        public DeployUnit GetUnitByName(string name)
        {
            return Units.Single(x => x.Name == name);
        }
    }
}