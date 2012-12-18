using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Deployment.Steps;
using AsimovDeploy.WinAgent.Framework.Tasks;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class FileCopyDeployUnit : DeployUnit
    {
        public string TargetPath { get; set; }
        public bool CleanTargetPath { get; set; }

        public override AsimovTask GetDeployTask(AsimovVersion version, ParameterValues parameterValues)
        {
            var task = new DeployTask(this, version, parameterValues);
            task.AddDeployStep<FileCopyDeployStep>();
            return task;
        }
    }
}