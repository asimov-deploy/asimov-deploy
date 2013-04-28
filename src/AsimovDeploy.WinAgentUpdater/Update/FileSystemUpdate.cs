using Ionic.Zip;

namespace AsimovDeploy.WinAgentUpdater.Update
{
    public class FileSystemUpdate
    {
        public string FilePath { get; set; }

        public void CopyNewBuildToInstallDir(string installDir)
        {
            using(ZipFile zipFile = ZipFile.Read(FilePath))
            {
                zipFile.ExtractAll(installDir);
            }
        }
    }
}