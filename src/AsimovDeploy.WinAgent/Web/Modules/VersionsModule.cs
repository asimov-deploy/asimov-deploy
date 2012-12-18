using System.Linq;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Web.Contracts;
using Nancy;

namespace AsimovDeploy.WinAgent.Web.Modules
{
    public class VersionsModule : NancyModule
    {
        public VersionsModule(IAsimovConfig config)
        {
            Get["/versions/{unitName}"] = parameters =>
                {
                    var unitName = (string) parameters.unitName;
                    var deployUnit = config.GetUnitByName(unitName);
                    var versions = config.GetPackageSourceFor(deployUnit)
                            .GetAvailableVersions(deployUnit.PackageInfo)
                            .Select(x =>
                                new DeployUnitVersionDTO()
                                {
                                    id = x.Id,
                                    timestamp = x.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"),
                                    version = x.Number,
                                    branch = x.Branch,
                                    commit = x.Commit
                                });

                    return Response.AsJson(versions);
            };
        }    
    }
}