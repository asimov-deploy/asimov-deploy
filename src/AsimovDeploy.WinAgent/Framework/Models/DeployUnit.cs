using System;
using System.Collections.Generic;
using System.Linq;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.Tasks;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public abstract class DeployUnit
    {
        public string Name { get; set; }
        public PackageInfo PackageInfo { get; set; }
        public string DataDirectory { get; set; }
        public string VerifyZipPath { get; set; }
        public string VerifyCommand { get; set; }
        
        public DeployStatus DeployStatus { get; protected set; }
        public DeployedVersion Version { get; protected set; }
        public string[] OnlyOnAgents { get; set; }
        
        public ActionParameterList DeployParameters { get; protected set; }
        public bool HasDeployParameters { get { return DeployParameters.Count > 0; } }

        protected DeployUnit()
        {
            DeployParameters = new ActionParameterList();
        }
        
        public abstract AsimovTask GetDeployTask(AsimovVersion version, ParameterValues parameterValues);

        public virtual AsimovTask GetVerifyTask()
        {
            return new NoOpTask();
        }

        public virtual DeployUnitInfo GetUnitInfo()
        {
            var deployUnitInfo = new DeployUnitInfo();
            deployUnitInfo.Name = Name;
            deployUnitInfo.HasDeployParameters = HasDeployParameters;

            if (Version == null)
            {
                Version = VersionUtil.GetCurrentVersion(DataDirectory);
                if (Version.DeployFailed)
                {
                    DeployStatus = DeployStatus.DeployFailed;
                }
            }

            deployUnitInfo.Version = Version;
            deployUnitInfo.DeployStatus = DeployStatus;

            return deployUnitInfo;
        }

        public IList<DeployedVersion> GetDeployedVersions()
        {
            return VersionUtil.ReadVersionLog(DataDirectory);
        }

        public bool IsValidForAgent(string agentName)
        {
            if (OnlyOnAgents == null)
                return true;

            return OnlyOnAgents.Any(x => x == agentName);
        }

        public void StartingDeploy(AsimovVersion newVersion, string logFileName)
        {
            DeployStatus = DeployStatus.Deploying;
            Version = new DeployedVersion()
            {
                DeployTimestamp = DateTime.Now,
                VersionId = newVersion.Id,
                VersionNumber = newVersion.Number,
                VersionBranch = newVersion.Branch,
                VersionTimestamp = newVersion.Timestamp,
                VersionCommit = newVersion.Commit,
                LogFileName = logFileName,
                DeployFailed = false
            };

            NodeFront.Notify(new DeployStartedEvent(Name, Version));
        }

        public void DeployCompleted()
        {
            DeployStatus = DeployStatus.NA;
            VersionUtil.UpdateVersionLog(DataDirectory, Version);
            var unitInfo = GetUnitInfo();

            NodeFront.Notify(new DeployCompletedEvent(Name, Version, unitInfo.Status));
        }

        public void DeployFailed()
        {
            DeployStatus = DeployStatus.DeployFailed;
            Version.DeployFailed = true;
            
            VersionUtil.UpdateVersionLog(DataDirectory, Version);
            
            NodeFront.Notify(new DeployFailedEvent(Name, Version));
        }
    }
}