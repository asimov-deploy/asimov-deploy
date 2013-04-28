namespace AsimovDeploy.WinAgentUpdater.Update
{
    public interface IConfigUpdate
    {
        int Version { get; set; }
        void CopyNewBuildToInstallDir(string configDir);
    }
}