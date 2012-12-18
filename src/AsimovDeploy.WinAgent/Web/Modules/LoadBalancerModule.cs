using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.LoadBalancers.Alteon;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Framework.Tasks;
using AsimovDeploy.WinAgent.Web.Commands;
using Nancy;
using Nancy.ModelBinding;

namespace AsimovDeploy.WinAgent.Web.Modules
{
    public class LoadBalancerModule : NancyModule
    {
        private readonly IAsimovConfig _config;
        private readonly ITaskExecutor _taskExecutor;

        public LoadBalancerModule(IAsimovConfig config, ITaskExecutor taskExecutor)
        {
            _config = config;
            _taskExecutor = taskExecutor;
            
            Get["/loadbalancer/listHosts"] = _ =>
            {
                if (_config.LoadBalancer.Password == null)
                    return Response.AsJson(new object[] { });

                using (var loadBalancer = new AlteonLoadBalancer(_config.LoadBalancer))
                {
                    loadBalancer.Login();
                    return Response.AsJson(loadBalancer.GetHostList());
                }
            };

            Post["/loadbalancer/change"] = _ =>
            {
                var command = this.Bind<ChangeLoadBalancerStateCommand>();
                _taskExecutor.AddTask(new ChangeLoadBalancerStates(command));
                return "OK";
            };

            Post["/loadbalancer/settings"] = _ =>
            {
                var command = this.Bind<UpdateLoadBalancerSettingsCommand>();
                _config.LoadBalancer.Password = command.password;
                
                if (!string.IsNullOrEmpty(command.host))
                    _config.LoadBalancer.Host = command.host;

                return "OK";
            };
        }
    }
}