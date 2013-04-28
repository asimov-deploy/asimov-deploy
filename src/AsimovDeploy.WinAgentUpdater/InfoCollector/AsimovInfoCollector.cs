using System;
using System.Net;
using AsimovDeploy.WinAgentUpdater.Update;
using Newtonsoft.Json.Linq;
using log4net;

namespace AsimovDeploy.WinAgentUpdater.InfoCollector {
    public class AsimovInfoCollector : InfoCollector {
        private readonly Uri _nodeFrontUrl;
        private readonly WebClient _webClient;

        public AsimovInfoCollector(string nodeFrontUrl, int agentPort) : base(agentPort)
        {
            _nodeFrontUrl = new Uri(nodeFrontUrl);
            _webClient = new WebClient();
        }

        protected override IConfigUpdate GetLatestBuild() {
            try
            {
                var path = "/update/config/";
                var buildInfo = DownloadJson(path);
                return new AsimovConfigUpdate {FileName = buildInfo.file, Uri = new Uri(_nodeFrontUrl, path + buildInfo.file), Version = (int)buildInfo.version};
            }
            catch(Exception ex) {
                _log.Error("Error while downloading config version info", ex);
                return new AsimovConfigUpdate { Version = 0 };
            }
        }

        protected override IAgentUpdate GetLatestVersion() {
            try
            {
                var path = "/update/agent/";
                var buildInfo = DownloadJson(path);
                return new AsimovAgentUpdate {FileName = buildInfo.file, Uri = new Uri(_nodeFrontUrl, path + buildInfo.file), Version = new Version((string) buildInfo.version)};
            }
            catch(Exception ex) {
                _log.Error("Error while downloading agent version info", ex);
                return new AsimovAgentUpdate { Version = new Version(0, 0, 0) };
            }
        }

        private dynamic DownloadJson(string uri) {
            var latestBuildUri = new Uri(_nodeFrontUrl, uri);
            var data = _webClient.DownloadString(latestBuildUri);
            return JObject.Parse(data);
        }
    }
}