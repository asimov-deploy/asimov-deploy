using System;

namespace AsimovDeploy.WinAgentUpdater.Update
{
    public class FileSystemAgentUpdate : FileSystemUpdate, IAgentUpdate
    {
        public Version Version { get; set; }
        public string FileName { get; set; }
    }
}