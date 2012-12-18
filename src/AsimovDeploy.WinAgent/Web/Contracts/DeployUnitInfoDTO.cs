namespace AsimovDeploy.WinAgent.Web.Contracts
{
    public class DeployUnitInfoDTO
    {
        public string name { get; set; }
        public string url { get; set; }
        public string version { get; set; }
        public string branch { get; set; }
        public string status { get; set; }
        public string info { get; set; }
        public bool hasDeployParameters { get; set; }
    }

    public class DeployedVersionDTO
    {
        public string versionNumber;
        public string versionTimestamp;
        public string versionCommit;
        public string versionBranch;
        public string deployedTimestamp;
    }
}