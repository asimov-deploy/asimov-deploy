using System;

namespace AsimovDeploy.WinAgent.Framework.LoadBalancers
{
    public class LoadBalancerCommunicationException : Exception
    {
        public LoadBalancerCommunicationException(string s) : base(s) { }
    }
}