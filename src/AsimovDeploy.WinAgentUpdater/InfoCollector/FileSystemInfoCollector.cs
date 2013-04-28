using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using AsimovDeploy.WinAgentUpdater.Update;

namespace AsimovDeploy.WinAgentUpdater.InfoCollector
{
    public class FileSystemInfoCollector : InfoCollector
    {
        private readonly string _watchFolder;

        public FileSystemInfoCollector(string watchFolder, int agentPort) : base(agentPort)
        {
            _watchFolder = watchFolder;
        }

        protected override IConfigUpdate GetLatestBuild()
        {
            if (!Directory.Exists(_watchFolder))
            {
                _log.Error("Watchfolder does not exist: " + _watchFolder);
                return null;
            }

            var regex = new Regex(@"AsimovDeploy.WinAgent.ConfigFiles-Version-(\d+).zip");
            var list = new List<FileSytemConfigUpdate>();

            foreach (var file in Directory.EnumerateFiles(_watchFolder))
            {
                var match = regex.Match(file);
                if (match.Success)
                {
                    list.Add(new FileSytemConfigUpdate()
                        {
                            FilePath = file,
                            Version = int.Parse(match.Groups[1].Value)
                        });
                }
            }

            return list.OrderByDescending(x => x.Version).FirstOrDefault();
        }

        protected override IAgentUpdate GetLatestVersion()
        {
            if (!Directory.Exists(_watchFolder))
            {
                _log.Error("Watchfolder does not exist: " + _watchFolder);
                return null;
            }

            var pattern = @"v(?<major>\d+)\.(?<minor>\d+)\.(?<build>\d+)";
            var regex = new Regex(pattern);
            var list = new List<FileSystemAgentUpdate>();

            foreach (var file in Directory.EnumerateFiles(_watchFolder))
            {
                var match = regex.Match(file);
                if (match.Success)
                {
                    list.Add(new FileSystemAgentUpdate()
                    {
                        FileName = file,
                        Version = new Version(int.Parse(match.Groups["major"].Value), int.Parse(match.Groups["minor"].Value), int.Parse(match.Groups["build"].Value))
                    });
                }
            }

            return list.OrderByDescending(x => x.Version).FirstOrDefault();
        }
    }
}