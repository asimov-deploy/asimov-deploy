using System;

namespace AsimovDeploy.WinAgentUpdater.Update {
    public class AsimovAgentUpdate : AsimovUpdate, IAgentUpdate {
        public Version Version { get; set; }
    }
}