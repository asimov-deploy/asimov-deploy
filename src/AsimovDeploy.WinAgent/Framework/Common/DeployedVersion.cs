using System;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public class DeployedVersion
    {
        public string VersionNumber;
        public string VersionId;
        public DateTime VersionTimestamp;
        public string VersionBranch;
        public string VersionCommit;
        public DateTime DeployTimestamp;
        public string LogFileName;
        public bool DeployFailed;
    }
}