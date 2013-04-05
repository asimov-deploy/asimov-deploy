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
using AsimovDeploy.WinAgent.Framework.Deployment.Steps;
using AsimovDeploy.WinAgent.Framework.Tasks;
using AsimovDeploy.WinAgent.Framework.WebSiteManagement;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class WebSiteDeployUnit : DeployUnit
    {
        public string SiteName { get; set; }
        public string SiteUrl { get; set; }

        public bool CleanDeploy { get; set; }

        public IList<string> VerifyUrls { get; set; }

        public WebSiteDeployUnit()
        {
            CleanDeploy = true; // default to true
        }

        public override AsimovTask GetDeployTask(AsimovVersion version, ParameterValues parameterValues)
        {
            var task = new DeployTask(this, version, parameterValues);
            task.AddDeployStep<UpdateWebSite>();
            return task;
        }

        public override AsimovTask GetVerifyTask()
        {
            if (!string.IsNullOrEmpty(VerifyCommand))
            {
                return new VerifyCommandTask(this);
            }
            return new VerifySiteTask(this);
        }

        public virtual IWebServer GetWebServer()
        {
            return new IIS7WebServer(SiteName, SiteUrl);
        }

        public override DeployUnitInfo GetUnitInfo()
        {
            var siteInfo = base.GetUnitInfo();

            var siteData = GetWebServer().GetInfo();
            if (siteData == null)
            {
                siteInfo.Status = UnitStatus.NotFound;
                siteInfo.Info = "";
                siteInfo.Version = new DeployedVersion() { VersionNumber = "0.0.0.0" };
                return siteInfo;
            }

            siteInfo.Url = SiteUrl.Replace("localhost", HostNameUtil.GetFullHostName());
            siteInfo.Status = (siteData.AppPoolStarted && siteData.SiteStarted) ? UnitStatus.Running : UnitStatus.Stopped;
            siteInfo.Info = string.Format("Last deployed: {0}", siteInfo.Version.DeployTimestamp);

            return siteInfo;
        }
    }
}