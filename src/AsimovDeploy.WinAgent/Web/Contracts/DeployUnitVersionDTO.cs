
namespace AsimovDeploy.WinAgent.Web.Contracts
{
    public class DeployUnitVersionDTO
    {
        public string version { get; set; }
        public string timestamp { get; set; }
        public string branch { get; set; }
        public string commit { get; set; }
        public string id { get; set; }

    }
}