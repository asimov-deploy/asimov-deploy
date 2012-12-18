using AsimovDeploy.WinAgent.Framework.Models;

namespace AsimovDeploy.WinAgent.Framework.Deployment.Steps
{
    public class CopyPackageToTempFolder : IDeployStep
    {
        private readonly IAsimovConfig _asimovConfig;

        public CopyPackageToTempFolder(IAsimovConfig asimovConfig)
        {
            _asimovConfig = asimovConfig;
        }

        public void Execute(DeployContext context)
        {
            var packageSource = _asimovConfig.GetPackageSourceFor(context.DeployUnit);
            
            context.TempFolderWithNewVersionFiles = packageSource.CopyAndExtractToTempFolder(context.NewVersion.Id, context.DeployUnit.PackageInfo, _asimovConfig.TempFolder);
        }
    }
    
}