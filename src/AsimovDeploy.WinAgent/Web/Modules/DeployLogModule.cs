using System.IO;
using System.Linq;
using AsimovDeploy.WinAgent.Framework.Models;
using Nancy;

namespace AsimovDeploy.WinAgent.Web.Modules
{
    public class DeployLogModule : NancyModule
    {
        public DeployLogModule(IAsimovConfig config)
        {

            Get["/deploylog/list/{unitName}"] = parameters =>
            {
                var deployUnit = config.GetUnitByName((string)parameters.unitName);
                if (deployUnit == null)
                    return 404;

                var deployedVersions = deployUnit.GetDeployedVersions();
                int position = 0;
                var jsonData = deployedVersions.Select(x => new 
                {
                    timestamp = x.DeployTimestamp.ToString("yyyy-MM-dd HH:mm:ss"),
                    version = x.VersionNumber,
                    commit = x.VersionCommit,
                    branch = x.VersionBranch,
                    status = x.DeployFailed == true ? "DeployFailed" : "Success",
                    position = position++,
                });

                return Response.AsJson(jsonData);
            };

            Get["/deploylog/file/{unitName}/{position}"] = parameters =>
            {
                var deployUnit = config.GetUnitByName((string)parameters.unitName);
                if (deployUnit == null)
                    return 404;

                var deployedVersions = deployUnit.GetDeployedVersions();
                var specific = deployedVersions.ElementAtOrDefault((int)parameters.position);
                if (specific == null)
                    return 404;

                var logFile = Path.Combine(deployUnit.DataDirectory, "Logs", specific.LogFileName);
                using (var fileStream = new StreamReader(logFile))
                {
                    return Response.AsText(fileStream.ReadToEnd());
                }
            };
        }
    }
}