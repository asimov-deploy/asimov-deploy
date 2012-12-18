using System;
using AsimovDeploy.WinAgent.Framework.LoadBalancers;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public interface IAsimovConfig
    {
        string Environment { get; }
        int HeartbeatIntervalSeconds { get; }
        string TempFolder { get; }
        string NodeFrontUrl { get;}
        int WebPort { get; }
        string ApiKey { get; set; }
        int LoadBalancerId { get; }
        int ConfigVersion { get; }

        DeployUnits Units { get; }

        DeployUnit GetUnitByName(string name);

        LoadBalancerSettings LoadBalancer { get; }
        
        Uri WebControlUrl { get; }
        
        PackageSource GetPackageSourceFor(DeployUnit deployUnit);
    }
}