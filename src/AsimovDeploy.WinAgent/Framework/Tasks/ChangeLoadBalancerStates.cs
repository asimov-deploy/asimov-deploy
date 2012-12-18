using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.LoadBalancers.Alteon;
using AsimovDeploy.WinAgent.Web.Commands;

namespace AsimovDeploy.WinAgent.Framework.Tasks
{
    public class ChangeLoadBalancerStates : AsimovTask
    {
        private readonly ChangeLoadBalancerStateCommand _command;

        public ChangeLoadBalancerStates(ChangeLoadBalancerStateCommand command)
        {
            _command = command;
        }

        protected override string InfoString()
        {
            return string.Format("Allow cookie persistent HTTP sessions: [{0}], Mark existing sessions for removal from session table: [{1}]", Config.LoadBalancer.AllowCookiePersistedSessions ? "y" : "n", Config.LoadBalancer.RemoveExistingConnectionsFromSessionTable ? "y" : "n");
        }

        protected override void Execute()
        {
            using (var loadBalancer = new AlteonLoadBalancer(Config.LoadBalancer))
            {
                loadBalancer.Login();

                foreach (var host in _command.hosts)
                {
                    switch (host.action)
                    {
                        case "enable":
                            loadBalancer.EnableHostById(host.Id);
                            NodeFront.Notify(new HostLoadBalancerStateChanged(host.Id, true));
                            Log.InfoFormat("Performing loadbalancer action {0} : {1}", host.action, host.Id);
                            break;
                        case "disable": 
                            loadBalancer.DisableHostById(host.Id);
                            NodeFront.Notify(new HostLoadBalancerStateChanged(host.Id, false));
                            Log.InfoFormat("Performing loadbalancer action {0} : {1}", host.action, host.Id);
                            break;
                    }
                }
            }
        }
    }
}