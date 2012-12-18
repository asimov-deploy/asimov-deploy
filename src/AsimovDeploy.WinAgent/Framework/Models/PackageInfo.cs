namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class PackageInfo
    {
        public string Source { get; set; }
        public string InternalPath { get; set; }
        public string SourceRelativePath { get; set; }

        public PackageInfo()
        {
            InternalPath = "";
        }
    }
}