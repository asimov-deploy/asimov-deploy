namespace AsimovDeploy.WinAgent.Web.Commands
{
    public class ChangeLoadBalancerStateCommand
    {
        public ChangeStateCommand[] hosts { get; set; }
    }

    public class ChangeStateCommand
    {
        public int Id { get; set; }
        public string action { get; set; }
    }

    public class UpdateLoadBalancerSettingsCommand
    {
        public string host { get; set; }
        public string password { get; set; }
    }
}
