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

using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Framework.Models.Units;
using AsimovDeploy.WinAgent.Framework.WebSiteManagement;
using log4net;

namespace AsimovDeploy.WinAgent.Framework.Deployment
{
    public class DeployContext
    {
        public DeployUnit DeployUnit { get; set; }

        public ParameterValues ParameterValues { get; set; }

        public AsimovVersion NewVersion { get; set; }

        public string PhysicalPath { get; set; }

        public string TempFolderWithNewVersionFiles { get; set; }

        public ILog Log { get; set; }

        public string LogFileName { get; set; }
    }
}