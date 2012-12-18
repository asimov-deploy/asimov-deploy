using System.ServiceProcess;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Deployment.Steps;
using AsimovDeploy.WinAgent.Framework.Tasks;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class WindowsServiceDeployUnit : DeployUnit
    {
        public string ServiceName { get; set; }
        public string Url { get; set; }

        public override AsimovTask GetDeployTask(AsimovVersion version, ParameterValues parameterValues)
        {
            var task = new DeployTask(this, version, parameterValues);
            task.AddDeployStep<UpdateWindowsService>();
            return task;
        }

        public override AsimovTask GetVerifyTask()
        {
            return new NoOpTask();
        }

        public override DeployUnitInfo GetUnitInfo()
        {
            var serviceManager = new ServiceController(ServiceName);
            
            var unitInfo = base.GetUnitInfo();
            unitInfo.Url = Url;
            
            try
            {
                unitInfo.Status = serviceManager.Status == ServiceControllerStatus.Running ? UnitStatus.Running : UnitStatus.Stopped;
                unitInfo.Info = string.Format("Last deployed: {0}", unitInfo.Version.DeployTimestamp);
            }
            catch
            {
                unitInfo.Status = UnitStatus.NotFound;
                unitInfo.Info = "";
            }
            
            return unitInfo;
        }
    }
}