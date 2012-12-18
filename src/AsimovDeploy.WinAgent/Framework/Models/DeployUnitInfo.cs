using AsimovDeploy.WinAgent.Framework.Common;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class DeployUnitInfo
    {
        public string Name { get; set; }
        public string Info { get; set; }
        public string Url { get; set; }

        public UnitStatus Status { get; set; }
        public DeployStatus DeployStatus { get; set; }
        
        public DeployedVersion Version { get; set; }

        public bool HasDeployParameters { get; set; }
    }
}