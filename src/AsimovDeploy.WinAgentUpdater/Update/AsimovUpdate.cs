using System;
using System.IO;
using System.Net;
using Ionic.Zip;

namespace AsimovDeploy.WinAgentUpdater.Update
{
    public abstract class AsimovUpdate
    {
        public Uri Uri { get; set; }
        public string FileName { get; set; }

        public void CopyNewBuildToInstallDir(string configDir)
        {
            var webClient = new WebClient();
            var filePath = Path.Combine(configDir, FileName);

            webClient.DownloadFile(Uri, filePath);

            using(ZipFile zipFile = ZipFile.Read(filePath))
            {
                zipFile.ExtractAll(configDir);
            }

            File.Delete(filePath);
        }
    }
}