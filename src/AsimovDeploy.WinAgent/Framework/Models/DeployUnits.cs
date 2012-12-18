using System.Collections.Generic;
using AsimovDeploy.WinAgent.Framework.Configuration;
using Newtonsoft.Json;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    [JsonConverter(typeof(DeployUnitConverter))]
    public class DeployUnits : List<DeployUnit>
    {

    }

    
}