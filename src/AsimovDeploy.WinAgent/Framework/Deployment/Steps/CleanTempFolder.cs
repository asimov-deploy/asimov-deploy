using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.Models;

namespace AsimovDeploy.WinAgent.Framework.Deployment.Steps
{
    public class CleanTempFolder : IDeployStep
    {
        private readonly IAsimovConfig _config;

        public CleanTempFolder(IAsimovConfig config)
        {
            _config = config;
        }

        public void Execute(DeployContext context)
        {
            DirectoryUtil.Clean(_config.TempFolder);
        }
    }
}