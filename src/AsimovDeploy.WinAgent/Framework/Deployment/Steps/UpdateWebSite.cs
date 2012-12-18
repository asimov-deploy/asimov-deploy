using System.IO;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.Models;

namespace AsimovDeploy.WinAgent.Framework.Deployment.Steps
{
    public class UpdateWebSite : IDeployStep
    {
        private readonly IAsimovConfig _config;

        public UpdateWebSite(IAsimovConfig config)
        {
            _config = config;
        }

        public void Execute(DeployContext context)
        {
            var deployUnit = (WebSiteDeployUnit) context.DeployUnit;
            var webServer = deployUnit.GetWebServer();

            var siteData = webServer.GetInfo();
            if (siteData == null)
                throw new DeployException("Site not found: " + deployUnit.SiteName);

            context.Log.Info("Stopping AppPool...");
            webServer.StopAppPool(); 

            context.PhysicalPath = siteData.PhysicalPath;

            CleanSitePhysicalPath(context, deployUnit.CleanDeploy);

            CopyNewFilesToPhysicalPath(context);

            context.Log.Info("Starting AppPool...");
            webServer.StartAppPool();
        }

        private void CopyNewFilesToPhysicalPath(DeployContext context)
        {
            context.Log.Info("Copying files...");
            
            DirectoryUtil.CopyDirectory(context.TempFolderWithNewVersionFiles, context.PhysicalPath);
        }

        private void CleanSitePhysicalPath(DeployContext context, bool cleanDeploy)
        {
            if (cleanDeploy)
            {
                context.Log.Info("Cleaning site physical path...");
                DirectoryUtil.Clean(context.PhysicalPath);    
            }
            else
            {
                context.Log.Info("Clean deploy disabled, skipping cleaning step");
            }
        }
    }
}