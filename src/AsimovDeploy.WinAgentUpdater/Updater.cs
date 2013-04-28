﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.ServiceProcess;
using System.Text.RegularExpressions;
using System.Threading;
using AsimovDeploy.WinAgentUpdater.InfoCollector;
using AsimovDeploy.WinAgentUpdater.Update;
using Ionic.Zip;
using Newtonsoft.Json;
using log4net;

namespace AsimovDeploy.WinAgentUpdater
{
    public class Updater
    {
        private Timer _timer;

        private static ILog _log = LogManager.GetLogger(typeof(Updater));
        private string _watchFolder;
        private int _port;
        private string _installDir;
        private string _nodeFrontUrl;

        private InfoCollector.InfoCollector _collector;

        private const int interval = 30000;
        
        public void Start()
        {
            _watchFolder = ConfigurationManager.AppSettings["Asimov.WatchFolder"];
            _port = Int32.Parse(ConfigurationManager.AppSettings["Asimov.WebPort"]);
            _installDir = ConfigurationManager.AppSettings["Asimov.InstallDir"];

            _nodeFrontUrl = ConfigurationManager.AppSettings["Asimov.NodeFrontUrl"];

            _collector = string.IsNullOrWhiteSpace(_nodeFrontUrl) ?
                    (InfoCollector.InfoCollector) new FileSystemInfoCollector(_watchFolder, _port) :
                   (InfoCollector.InfoCollector) new AsimovInfoCollector(_nodeFrontUrl, _port);

            _timer = new Timer(TimerTick, null, 0, interval);
        }

        public void Stop()
        {
            _timer.Change(Timeout.Infinite, Timeout.Infinite);
        }

        private void TimerTick(object state)
        {
            _timer.Change(Timeout.Infinite, Timeout.Infinite);

            _log.Info("Looking for new version");

            try
            {
                var updateInfo = _collector.Collect();

                _log.InfoFormat(updateInfo.ToString());

                if (!updateInfo.NeedsAnyUpdate())
                    return;

                using (var service = new ServiceController("AsimovDeploy.WinAgent"))
                {
                    StopService(service);
                    
                    if (updateInfo.NewBuildFound())
                    {
                        UpdateWinAgentWithNewBuild(updateInfo.LastBuild);
                    }

                    if (updateInfo.NewBuildFound() || updateInfo.NewConfigFound())
                    {
                        UpdateWinAgentConfig(updateInfo.LastConfig);
                    }

                    StartService(service);
                }
            }
            catch(Exception ex)
            {
                _log.Error("Failed to check for upgrade", ex);
            }
            finally
            {
                _timer.Change(interval, interval);
            }
        }

        private void UpdateWinAgentConfig(IConfigUpdate lastConfig)
        {
            _log.Info("Updating config to version " + lastConfig.Version);

            var configDir = Path.Combine(_installDir, "ConfigFiles");

            CleanFolder(configDir);

            lastConfig.CopyNewBuildToInstallDir(configDir);
        }

        private void UpdateWinAgentWithNewBuild(IAgentUpdate lastBuild)
        {
            _log.InfoFormat("Installing new build {0}", lastBuild.Version);
            
            CleanFolder(_installDir);

            lastBuild.CopyNewBuildToInstallDir(_installDir);
        }

        private static void StopService(ServiceController serviceController)
        {
            if (serviceController.Status == ServiceControllerStatus.Running)
            {
                _log.Info("Stopping AsimovDeploy...");
                serviceController.Stop();
                serviceController.WaitForStatus(ServiceControllerStatus.Stopped);
                _log.Info("AsimovDeploy stopped");
            }
            else
            {
                _log.Info("AsimovDeploy Service was not running, trying to update and start it");
            }
        }

        private void StartService(ServiceController serviceController)
        {
            _log.Info("Starting service...");
            serviceController.Start();
            serviceController.WaitForStatus(ServiceControllerStatus.Running, TimeSpan.FromMinutes(1));
            
            _log.Info("Service  started");
        }

        private void CleanFolder(string destinationFolder)
        {
            if (destinationFolder.Contains("Asimov") == false)
            {
                throw new Exception("Asimov install dir does not contain asimov, will abort upgrade");
            }

            var dir = new DirectoryInfo(destinationFolder);
            foreach (FileInfo file in dir.GetFiles())
            {
                if (!file.Extension.Contains("log"))
                    file.Delete();
            }

            foreach (DirectoryInfo subDirectory in dir.GetDirectories()) subDirectory.Delete(true);
        }
    }
}