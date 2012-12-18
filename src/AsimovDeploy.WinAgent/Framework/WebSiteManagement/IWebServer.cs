namespace AsimovDeploy.WinAgent.Framework.WebSiteManagement
{
    public interface IWebServer
    {
        void StartAppPool();
        void StopAppPool();

        WebSiteData GetInfo();
    }
}