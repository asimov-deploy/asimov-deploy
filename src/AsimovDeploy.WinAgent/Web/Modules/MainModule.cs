using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.Models;
using Nancy;

namespace AsimovDeploy.WinAgent.Web.Modules
{
    public class MainModule : NancyModule
    {
        public MainModule(IAsimovConfig config)
        {
            Get["/"] = _ => VersionUtil.GetAgentVersion();

            Get["/version"] = _ =>
                {
                    var resp = new
                        {
                            version = VersionUtil.GetAgentVersion(),
                            configVersion = config.ConfigVersion
                        };
                    return Response.AsJson(resp);
                };
        }
    }
}