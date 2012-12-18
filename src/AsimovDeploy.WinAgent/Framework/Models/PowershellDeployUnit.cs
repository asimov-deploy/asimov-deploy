using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Deployment.Steps;
using AsimovDeploy.WinAgent.Framework.Tasks;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class PowerShellDeployUnit : DeployUnit
    {
        public string Script { get; set; }
        public string Url { get; set; }
        
        public override AsimovTask GetDeployTask(AsimovVersion version, ParameterValues parameterValues)
        {
            var task = new DeployTask(this, version, parameterValues);
            task.AddDeployStep<PowerShellDeployStep>();
            return task;
        }

        public override DeployUnitInfo GetUnitInfo()
        {
            var deployUnitInfo = base.GetUnitInfo();
            
            deployUnitInfo.Status = UnitStatus.NA; 
            deployUnitInfo.Url = Url != null ? Url.Replace("localhost", HostNameUtil.GetFullHostName()) : null;
            deployUnitInfo.Info = string.Format("Last deployed: {0}", deployUnitInfo.Version.DeployTimestamp);
            
            return deployUnitInfo;
        }
    }
}