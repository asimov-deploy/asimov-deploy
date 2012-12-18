using System;

namespace AsimovDeploy.WinAgent.Framework.Events
{
    public class AsimovEvent
    {
        public string eventName { get; set; }
        public string agentName { get; set; }

        public AsimovEvent()
        {
            agentName = Environment.MachineName;
        }
    }
}