using System;

namespace AsimovDeploy.WinAgent.Framework.LoadBalancers
{
    public interface ILoadBalancer : IDisposable
    {
        void Login();

        HostStatus[] GetHostList();
        HostStatus GetHostStatusById(int id);
        void EnableHostById(int id);
        void DisableHostById(int id);
    }

    public class HostStatus
    {
        public int id { get; set; }
        public string name { get; set; }
        public bool enabled { get; set; }
    }
}