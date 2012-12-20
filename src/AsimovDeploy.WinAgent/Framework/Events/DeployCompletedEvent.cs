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

namespace AsimovDeploy.WinAgent.Framework.Events
{
    public class DeployCompletedEvent : AsimovEvent
    {
        public string unitName { get; set; }
        public string version { get; set; }
        public string branch { get; set; }
        public string status { get; set; }

        public DeployCompletedEvent(string unitName, DeployedVersion version, UnitStatus status)
        {
            eventName = "deployCompleted";
            this.unitName = unitName;
            this.version = version.VersionNumber;
            this.branch = version.VersionBranch;
            this.status = status.ToString();
        }
    }

    public class DeployFailedEvent : AsimovEvent
    {
        public string unitName { get; set; }
        public string version { get; set; }
        public string branch { get; set; }

        public DeployFailedEvent(string unitName, DeployedVersion version)
        {
            eventName = "deployFailed";
            this.unitName = unitName;
            this.version = version.VersionNumber;
            this.branch = version.VersionBranch;
        }
    }

    public class DeployStartedEvent : AsimovEvent
    {
        public string unitName { get; set; }
        public string version { get; set; }
        public string branch { get; set; }

        public DeployStartedEvent(string unitName, DeployedVersion version)
        {
            this.eventName = "deployStarted";
            this.unitName = unitName;
            this.version = version.VersionNumber;
            this.branch = version.VersionBranch;
        }
    }
}