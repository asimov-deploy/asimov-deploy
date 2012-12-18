using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Models;

namespace AsimovDeploy.WinAgent.Framework.Deployment.Steps
{
    public class FileCopyDeployStep : IDeployStep
    {
        public void Execute(DeployContext context)
        {
            var deployUnit = (FileCopyDeployUnit)context.DeployUnit;

            if (deployUnit.CleanTargetPath)
                DirectoryUtil.Clean(deployUnit.TargetPath);

            DirectoryUtil.CopyDirectory(context.TempFolderWithNewVersionFiles, deployUnit.TargetPath);
        }
    }
}