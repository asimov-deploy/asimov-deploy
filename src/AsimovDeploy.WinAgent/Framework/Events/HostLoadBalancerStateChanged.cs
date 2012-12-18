namespace AsimovDeploy.WinAgent.Framework.Events
{
    public class HostLoadBalancerStateChanged : AsimovEvent
    {
        public int id { get; set; }
        public bool enabled { get; set; }

        public HostLoadBalancerStateChanged(int id, bool enabled)
        {
            eventName = "loadBalancerStateChanged";
            this.id = id;
            this.enabled = enabled;
        }
    }
}