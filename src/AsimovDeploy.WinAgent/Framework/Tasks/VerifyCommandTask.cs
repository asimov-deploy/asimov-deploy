/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.Models;
using Ionic.Zip;

namespace AsimovDeploy.WinAgent.Framework.Tasks
{
    public class VerifyCommandTask : AsimovTask
    {
        private WebSiteDeployUnit _deployUnit;
        private bool allPassed;
        private string _zipPath;
        private string _command;

        public VerifyCommandTask(WebSiteDeployUnit webSiteDeployUnit, string zipPath, string command)
        {
            _deployUnit = webSiteDeployUnit;
            _zipPath = zipPath;
            _command = command;
        }

        protected override void Execute()
        {
            CleanTempFolderAndExtractVerifyPackage();

            allPassed = true;

            using (var p = new Process())
            {
                // Redirect the output stream of the child process.
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.RedirectStandardOutput = true;
                p.StartInfo.RedirectStandardError = true;
                p.StartInfo.WorkingDirectory = Config.TempFolder;

                var commandParts = GetCommandParts();

                p.StartInfo.FileName = Path.Combine(Config.TempFolder, commandParts[0]);
                p.StartInfo.CreateNoWindow = true;

                p.StartInfo.Arguments = string.Join(" ", commandParts, 1, commandParts.Length - 1);

                p.Start();

                ListenToStream(p.StandardOutput, CommandStandardOutput,  () => Log.Debug("Verify command output ended"));
                ListenToStream(p.StandardError, line => Log.Error(line), () => Log.Debug("Verify command error output ended"));

                p.WaitForExit((int)TimeSpan.FromMinutes(10).TotalMilliseconds);

                if (p.ExitCode != 0)
                {
                    NodeFront.Notify(new VerifyProgressEvent() { pass = false, unitName = _deployUnit.Name, message = "Verify command failed" });
                }

                if (!p.HasExited)
                    p.Kill();

                NodeFront.Notify(new VerifyProgressEvent() { completed = true, unitName = _deployUnit.Name, pass = allPassed });
            }
        }


        private void CleanTempFolderAndExtractVerifyPackage()
        {
            DirectoryUtil.Clean(Config.TempFolder);

            var webAppInfo = _deployUnit.GetWebServer().GetInfo();

            var zipPath = Path.Combine(webAppInfo.PhysicalPath, _zipPath);

            using (var zipFile = ZipFile.Read(zipPath))
            {
                zipFile.ExtractAll(Config.TempFolder);
            }
        }

        private string[] GetCommandParts()
        {
            var siteUrl = _deployUnit.SiteUrl.Replace("localhost", HostNameUtil.GetFullHostName());
            var verifyCommand = _command.Replace("%SITE_URL%", siteUrl);
            var commandParts = verifyCommand.Split(new[] {' '});
            return commandParts;
        }

        private void ListenToStream(StreamReader input, Action<string> action, Action done)
        {
            new Thread(a =>
            {
                var buffer = new char[1];
                var str = new StringBuilder();
                while (input.Read(buffer, 0, 1) > 0)
                {
                    str.Append(buffer[0]);
                    if (buffer[0] == '\n')
                    {
                        var line = str.ToString();
                        action(line);
                        str.Clear();
                    }
                };

                done();
            }).Start();
        }


        private void CommandStandardOutput(string line)
        {
            if (line.Contains("PASS") || line.Contains("FAIL"))
            {
                var evt = new VerifyProgressEvent()
                              {
                                  pass = line.Contains("PASS"),
                                  message = line,
                                  completed = false,
                                  unitName = _deployUnit.Name
                              };

                allPassed = evt.pass && allPassed;
                NodeFront.Notify(evt);
            }

            Log.Debug(line);
        }
    }
}