using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.LoadBalancers;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class AsimovConfig : IAsimovConfig
    {
        public string Environment { get; set; }
        public int HeartbeatIntervalSeconds { get; set; }
        public int WebPort { get; set; }
        public string ApiKey { get; set; }
        public int LoadBalancerId { get; set; }
        public int ConfigVersion { get; set; }

        public string TempFolder { get { return Path.Combine(DataFolder, "Temp"); } }
        public string DataFolder { get; set; }

        public string NodeFrontUrl { get; set; }
        
        public DeployUnits Units { get; set; }
        
        public LoadBalancerSettings LoadBalancer { get; set; }

        public PackageSourceList PackageSources { get; set; }

        public Uri WebControlUrl
        {
            get { return new Uri(string.Format("http://{0}:{1}", HostNameUtil.GetFullHostName(), WebPort)); }
        }

        public PackageSource GetPackageSourceFor(DeployUnit deployUnit)
        {
            return PackageSources.Single(x => x.Name == deployUnit.PackageInfo.Source);
        }

        public AsimovConfig()
        {
            Units = new DeployUnits();
        }

        public DeployUnit GetUnitByName(string name)
        {
            return Units.Single(x => x.Name == name);
        }
    }
}