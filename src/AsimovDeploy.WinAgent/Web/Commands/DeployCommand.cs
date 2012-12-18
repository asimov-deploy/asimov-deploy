using System.Collections.Generic;

namespace AsimovDeploy.WinAgent.Web.Commands
{
    public class DeployCommand : AsimovCommand
    {
        public string unitName { get; set; }
        public string versionId { get; set; }
        public string password { get; set; }

        public Dictionary<string, object> parameters { get; set; }
    }

    public class AsimovCommand
    {
       
    }
}
