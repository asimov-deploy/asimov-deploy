/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

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