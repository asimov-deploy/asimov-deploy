using System;

namespace AsimovDeploy.WinAgentUpdater
{
    public class AsimovConfigUpdate
    {
        public string FilePath { get; set; }
        public int Version { get; set; }
    }

    public class AsimovVersion
    {
        public Version Version { get; set; }
        public string FilePath { get; set; }
    }
}