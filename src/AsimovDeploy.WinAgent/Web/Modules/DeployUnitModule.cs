using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Web.Contracts;
using Nancy;

namespace AsimovDeploy.WinAgent.Web.Modules
{
    public class DeployUnitModule : NancyModule
    {
        public DeployUnitModule(IAsimovConfig config)
        {
            Get["/units/list"] = _ =>
            {
                var units = new List<DeployUnitInfoDTO>();

                foreach (var deployUnit in config.Units)
                {
                    var unitInfo = deployUnit.GetUnitInfo();
                    var unitInfoDto = new DeployUnitInfoDTO();
                    unitInfoDto.name = unitInfo.Name;
                    unitInfoDto.info = unitInfo.Info;

                    if (unitInfo.DeployStatus != DeployStatus.NA)
                    {
                        unitInfoDto.status = unitInfo.DeployStatus.ToString();
                        unitInfoDto.info = "";
                    }
                    else
                        unitInfoDto.status = unitInfo.Status.ToString();                        
                    
                    unitInfoDto.url = unitInfo.Url;
                    unitInfoDto.version = unitInfo.Version.VersionNumber;
                    unitInfoDto.branch = unitInfo.Version.VersionBranch;
                    unitInfoDto.hasDeployParameters = unitInfo.HasDeployParameters;

                    units.Add(unitInfoDto);
                }
                
                return Response.AsJson(units);
            };

            Get["/units/deploy-parameters/{unitName}"] = urlArgs =>
            {
                var deployUnit = config.GetUnitByName((string)urlArgs.unitName);
                if (deployUnit == null)
                    return 404;

                var parameters = new List<dynamic>();
                foreach (var deployParameter in deployUnit.DeployParameters)
                    parameters.Add(deployParameter.GetDescriptor());

                return Response.AsJson(parameters);
            };
        }
    }
}