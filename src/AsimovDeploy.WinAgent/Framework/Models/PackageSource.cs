using System.Collections.Generic;
using System.Linq;
using Ionic.Zip;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public abstract class PackageSource
    {
        public string Name { get; set; }

        public abstract IList<AsimovVersion> GetAvailableVersions(PackageInfo packageInfo);
        public abstract AsimovVersion GetVersion(string versionId, PackageInfo packageInfo);
        public abstract string CopyAndExtractToTempFolder(string versionId, PackageInfo packageInfo, string tempFolder);

        protected void Extract(string localFile, string tempFolder, string internalZipPath)
        {
            using (var zipFile = ZipFile.Read(localFile))
            {
                if (string.IsNullOrEmpty(internalZipPath))
                {
                    zipFile.ExtractAll(tempFolder);
                }
                else
                {
                    var selection = (from e in zipFile.Entries
                                     where (e.FileName).StartsWith(internalZipPath)
                                     select e);

                    foreach (var e in selection)
                    {
                        e.Extract(tempFolder);
                    }                    
                }
            }
        }
    }
}