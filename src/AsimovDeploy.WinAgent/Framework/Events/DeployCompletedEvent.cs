using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Models;

namespace AsimovDeploy.WinAgent.Framework.Events
{
    public class DeployCompletedEvent : AsimovEvent
    {
        public string unitName { get; set; }
        public string version { get; set; }
        public string branch { get; set; }
        public string status { get; set; }
        
        public DeployCompletedEvent(string unitName, DeployedVersion version, UnitStatus status)
        {
            eventName = "deployCompleted";
            this.unitName = unitName;
            this.version = version.VersionNumber;
            this.branch = version.VersionBranch;
            this.status = status.ToString();
        }
    }

    public class DeployFailedEvent : AsimovEvent
    {
        public string unitName { get; set; }
        public string version { get; set; }
        public string branch { get; set; }
        
        public DeployFailedEvent(string unitName, DeployedVersion version)
        {
            eventName = "deployFailed";
            this.unitName = unitName;
            this.version = version.VersionNumber;
            this.branch = version.VersionBranch;
        }
    }

    public class DeployStartedEvent : AsimovEvent
    {
        public string unitName { get; set; }
        public string version { get; set; }
        public string branch { get; set; }

        public DeployStartedEvent(string unitName, DeployedVersion version)
        {
            this.eventName = "deployStarted";
            this.unitName = unitName;
            this.version = version.VersionNumber;
            this.branch = version.VersionBranch;
        }
    }
}