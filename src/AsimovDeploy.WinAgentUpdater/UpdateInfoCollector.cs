using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using log4net;

namespace AsimovDeploy.WinAgentUpdater
{
    public class UpdateInfoCollector
    {
        private static ILog _log = LogManager.GetLogger(typeof (UpdateInfoCollector));

        private readonly string _watchFolder;
        private readonly int _port;

        public UpdateInfoCollector(string watchFolder, int port)
        {
            _watchFolder = watchFolder;
            _port = port;
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

        private AsimovConfigUpdate GetLatestBuild()
        {
            if (!Directory.Exists(_watchFolder))
            {
                _log.Error("Watchfolder does not exist: " + _watchFolder);
                return null;
            }

            var regex = new Regex(@"AsimovDeploy.WinAgent.ConfigFiles-Version-(\d+).zip");
            var list = new List<AsimovConfigUpdate>();

            foreach (var file in Directory.EnumerateFiles(_watchFolder))
            {
                var match = regex.Match(file);
                if (match.Success)
                {
                    list.Add(new AsimovConfigUpdate()
                        {
                            FilePath = file,
                            Version = int.Parse(match.Groups[1].Value)
                        });
                }
            }

            return list.OrderByDescending(x => x.Version).FirstOrDefault();
        }

        private AsimovVersion GetLatestVersion()
        {
            if (!Directory.Exists(_watchFolder))
            {
                _log.Error("Watchfolder does not exist: " + _watchFolder);
                return null;
            }

            var pattern = @"v(?<major>\d+)\.(?<minor>\d+)\.(?<build>\d+)";
            var regex = new Regex(pattern);
            var list = new List<AsimovVersion>();

            foreach (var file in Directory.EnumerateFiles(_watchFolder))
            {
                var match = regex.Match(file);
                if (match.Success)
                {
                    list.Add(new AsimovVersion()
                    {
                        FilePath = file,
                        Version = new Version(int.Parse(match.Groups["major"].Value), int.Parse(match.Groups["minor"].Value), int.Parse(match.Groups["build"].Value))
                    });
                }
            }

            return list.OrderByDescending(x => x.Version).FirstOrDefault();
        }

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
            string url = String.Format("http://{0}:{1}/version", GetFullHostName(), _port);
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
                            var parts = version.Split('.');
                            return new AgentVersionInfo()
                                {
                                    Version = new Version(int.Parse(parts[0]), int.Parse(parts[1]), int.Parse(parts[2])),
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