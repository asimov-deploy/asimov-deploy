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
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.Models.Units;
using Ionic.Zip;

namespace AsimovDeploy.WinAgent.Framework.Tasks
{
    public class VerifyCommandTask : AsimovTask
    {
        private readonly WebSiteDeployUnit deployUnit;
	    private readonly string zipPath;
	    private readonly string command;
	    private dynamic report;
	    
	    public VerifyCommandTask(WebSiteDeployUnit webSiteDeployUnit, string zipPath, string command)
        {
            deployUnit = webSiteDeployUnit;
            this.zipPath = zipPath;
            this.command = command;
        }

        protected override void Execute()
        {
            CleanTempFolderAndExtractVerifyPackage();

            using (var p = new Process())
            {
				NodeFront.Notify(new VerifyProgressEvent(deployUnit.Name) { started = true });

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

                ListenToStream(p.StandardOutput, ParseVerifyCommandOutput,  () => Log.Debug("Verify command output ended"));
                ListenToStream(p.StandardError, line => Log.Error(line), () => Log.Debug("Verify command error output ended"));

                p.WaitForExit((int)TimeSpan.FromMinutes(10).TotalMilliseconds);
				
                if (!p.HasExited)
                    p.Kill();

				NodeFront.Notify(new VerifyProgressEvent(deployUnit.Name) { completed = true, report = report });
            }
        }

        private void CleanTempFolderAndExtractVerifyPackage()
        {
			DirectoryUtil.Clean(Config.TempFolder);

			var webAppInfo = deployUnit.GetWebServer().GetInfo();

			var zipPath = Path.Combine(webAppInfo.PhysicalPath, this.zipPath);

			using (var zipFile = ZipFile.Read(zipPath))
			{
				zipFile.ExtractAll(Config.TempFolder);
			}
        }

        private string[] GetCommandParts()
        {
            var siteUrl = deployUnit.SiteUrl.Replace("localhost", HostNameUtil.GetFullHostName());
            var verifyCommand = command.Replace("%SITE_URL%", siteUrl);
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


        private void ParseVerifyCommandOutput(string line)
        {
			if (line.StartsWith("##asimov-deploy"))
			{
				HandleAssimovMessage(line);
			}

	        Log.Debug(line);
        }

		private void HandleAssimovMessage(string line)
	    {
		    var keys = ConsoleOutputParseUtil.ParseKeyValueString(line);

			if (keys.ContainsKey("image"))
			{
				NodeFront.Notify(new VerifyProgressEvent(deployUnit.Name)
				{
					image = new
					{
						title = keys["title"],
						url = GetUrlForFileInTempReportsFolder(keys["image"])
					}
				});
			}

			if (keys.ContainsKey("test"))
			{
				NodeFront.Notify(new VerifyProgressEvent(deployUnit.Name)
				{
					test = new { pass = keys["pass"] == "true", message = keys["test"] }
				});
			}

			if (keys.ContainsKey("report"))
			{
				report = new
				{
					title = keys["title"],
					url = GetUrlForFileInTempReportsFolder(keys["report"])
				};
			}
	    }

	    private string GetUrlForFileInTempReportsFolder(string file)
	    {
		    return new Uri(Config.WebControlUrl, "temp-reports/" + file).ToString();
	    }
    }
}