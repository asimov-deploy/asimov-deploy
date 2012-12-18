using System;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class AsimovVersion
    {
        public string Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string Number { get; set; }
        public string Branch { get; set; }
        public string Commit { get; set; }
    }
}