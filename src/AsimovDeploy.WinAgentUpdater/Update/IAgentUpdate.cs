using System;

namespace AsimovDeploy.WinAgentUpdater.Update {
    public interface IAgentUpdate {
        Version Version { get; }
        void CopyNewBuildToInstallDir(string installDir);
    }
}