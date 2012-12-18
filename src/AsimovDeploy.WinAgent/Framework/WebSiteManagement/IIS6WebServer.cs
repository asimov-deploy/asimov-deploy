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