using AsimovDeploy.WinAgent.Framework.WebSiteManagement;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class IIS6WebSiteDeployUnit : WebSiteDeployUnit
    {
        public override IWebServer GetWebServer()
        {
            return new IIS6WebServer(SiteName);
        }
    }
}