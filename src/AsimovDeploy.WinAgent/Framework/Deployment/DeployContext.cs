using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Models;
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