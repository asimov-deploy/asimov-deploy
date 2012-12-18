using System;
using System.Collections.Generic;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class AsimovWebPackageSource : PackageSource
    {
        public Uri Uri { get; set; }

        public override IList<AsimovVersion> GetAvailableVersions(PackageInfo packageInfo)
        {
            throw new NotImplementedException();
        }

        public override AsimovVersion GetVersion(string versionId, PackageInfo packageInfo)
        {
            throw new NotImplementedException();
        }

        public override string CopyAndExtractToTempFolder(string versionId, PackageInfo packageInfo, string tempFolder)
        {
            throw new NotImplementedException();
        }
    }
}