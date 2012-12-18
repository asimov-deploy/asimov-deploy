namespace AsimovDeploy.WinAgentUpdater
{
    public class UpdateInfo
    {
        public AsimovVersion LastBuild { get; set; }
        public AsimovConfigUpdate LastConfig { get; set; }
        public AgentVersionInfo Current { get; set; }

        public bool HasLastBuild { get { return LastBuild != null; }}
        public bool HasLastConfig { get { return LastConfig != null; } }

        public bool NeedsAnyUpdate()
        {
            return NewBuildFound() || NewConfigFound();
        }

        public bool NewConfigFound()
        {
            return HasLastConfig && Current.ConfigVersion < LastConfig.Version;
        }

        public bool NewBuildFound()
        {
            return HasLastBuild && Current.Version < LastBuild.Version;
        }
        
        public override string ToString()
        {
            return string.Format("Current Build: {0}, Current ConfigVersion: {1}, LatestBuild: {2}, LatestConfig: {3}", Current.Version, Current.ConfigVersion,
                                 HasLastBuild ? LastBuild.Version.ToString() : "NA", HasLastConfig ? LastConfig.Version.ToString() : "NA");


        }


    }
}