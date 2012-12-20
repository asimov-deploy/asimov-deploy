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

using AsimovDeploy.WinAgent.Framework.WebSiteManagement.IIS6;

namespace AsimovDeploy.WinAgent.Framework.WebSiteManagement
{
    public class IIS6WebServer : IWebServer
    {
        private readonly string _siteName;

        public IIS6WebServer(string siteName)
        {
            _siteName = siteName;
        }

        public void StartAppPool()
        {
            InternetInformationServer iis = new InternetInformationServer();
            WebSite webSite = iis.GetWebSite(_siteName);
            webSite.Start();
        }

        public void StopAppPool()
        {
            InternetInformationServer iis = new InternetInformationServer();
            WebSite webSite = iis.GetWebSite(_siteName);
            webSite.Stop();
        }

        public WebSiteData GetInfo()
        {
            InternetInformationServer iis = new InternetInformationServer();
            WebSite webSite = iis.GetWebSite(_siteName);

            if (webSite == null)
                return null;

            var siteData = new WebSiteData();
            var dirSettings = webSite.DirectorySettings;
            siteData.AppPoolName = (string)dirSettings.GetInstance(dirSettings.Path).GetPropertyValue("AppPoolId");
            siteData.PhysicalPath = (string)dirSettings.GetInstance(dirSettings.Path).GetPropertyValue("Path");
            siteData.SiteStarted = webSite.CurrentState == ServerState.Started;
            siteData.AppPoolStarted = true;

            return siteData;
        }
    }
}