namespace AsimovDeploy.WinAgent.Framework.LoadBalancers
{
    public interface ILoadBalancerSettings
    {
        string Host { get; }
        string Password { get; }
        bool AllowCookiePersistedSessions { get; }
        bool RemoveExistingConnectionsFromSessionTable { get; }
    }


    public class LoadBalancerSettings : ILoadBalancerSettings
    {
        public string Host { get; set; }
        public string Password { get; set; }

        public bool AllowCookiePersistedSessions { get; set; }
        public bool RemoveExistingConnectionsFromSessionTable { get; set; }
    }
}