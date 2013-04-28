using System;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using AsimovDeploy.WinAgentUpdater.Update;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using log4net;

namespace AsimovDeploy.WinAgentUpdater.InfoCollector
{
    public abstract class InfoCollector
    {
        protected static ILog _log = LogManager.GetLogger(typeof (FileSystemInfoCollector));
        private readonly int _agentPort;

        protected InfoCollector(int agentPort)
        {
            _agentPort = agentPort;
        }

        public UpdateInfo Collect()
        {
            return new UpdateInfo()
            {
                LastBuild = GetLatestVersion(),
                LastConfig = GetLatestBuild(),
                Current = GetCurrentBuild()
            };
        }

        protected abstract IConfigUpdate GetLatestBuild();
        protected abstract IAgentUpdate GetLatestVersion();

        public static string GetFullHostName()
        {
            var ipProperties = IPGlobalProperties.GetIPGlobalProperties();
            if (ipProperties.DomainName != string.Empty)
                return string.Format("{0}.{1}", ipProperties.HostName, ipProperties.DomainName);
            else
                return ipProperties.HostName;
        }
        
        private AgentVersionInfo GetCurrentBuild()
        {
            string url = String.Format("http://{0}:{1}/version", GetFullHostName(), _agentPort);
            try
            {
                using (var response = WebRequest.Create(url).GetResponse())
                {
                    using (var reader = new StreamReader(response.GetResponseStream()))
                    {
                        using (var jsonReader = new JsonTextReader(reader))
                        {
                            var jObject = JObject.Load(jsonReader);
                            var version = (string)jObject.Property("version").Value;
                            return new AgentVersionInfo()
                            {
                                Version = new Version(version),
                                ConfigVersion = (int) jObject.Property("configVersion")
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _log.ErrorFormat("Failed fetch version from: {0}", url);
                _log.Error(ex);
                return new AgentVersionInfo() { Version = new Version(0,0,0),  ConfigVersion = 0 };
            }
        }
    }
}