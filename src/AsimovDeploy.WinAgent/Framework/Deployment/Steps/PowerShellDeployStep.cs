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
using AsimovDeploy.WinAgent.Framework.Models;

namespace AsimovDeploy.WinAgent.Framework.Deployment.Steps
{
    public class PowerShellDeployStep : IDeployStep
    {
        private readonly IAsimovConfig _config;

        public PowerShellDeployStep(IAsimovConfig config)
        {
            _config = config;
        }

        public void Execute(DeployContext context)
        {
            CreateScriptFile(context);

            using (var p = new Process())
            {
                // Redirect the output stream of the child process.
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.RedirectStandardOutput = true;
                p.StartInfo.RedirectStandardError = true;
                p.StartInfo.WorkingDirectory = _config.TempFolder;
                p.StartInfo.FileName = @"C:\Windows\system32\WindowsPowerShell\v1.0\powershell.exe";
                p.StartInfo.CreateNoWindow = true;

                p.StartInfo.Arguments = string.Format("-NoProfile -ExecutionPolicy Unrestricted -File asimov_generated.ps1");

                p.Start();

                Redirect(p.StandardOutput, str => context.Log.Info(str));
                Redirect(p.StandardError, str => context.Log.Info(str));

                p.WaitForExit((int)TimeSpan.FromMinutes(20).TotalMilliseconds);

                if (p.ExitCode != 0)
                    throw new DeployException("Powershell script did not complete successfully");
            }
        }

        private void CreateScriptFile(DeployContext context)
        {
            var deployUnit = (PowerShellDeployUnit) context.DeployUnit;

            var filePath = Path.Combine(_config.TempFolder, "asimov_generated.ps1");
            using (var fs = new StreamWriter(filePath, false, Encoding.UTF8))
            {
                var script = new StringBuilder(deployUnit.Script)
                    .Replace("%TEMP_FOLDER%", _config.TempFolder)
                    .Replace("%MACHINE_NAME%", Environment.MachineName);

                foreach (var parameter in context.DeployUnit.DeployParameters)
                {
                    var value = context.ParameterValues.GetValue(parameter.Name);
                    parameter.ApplyToPowershellScript(script, value);
                }

                fs.Write(script);
            }
        }

        private void Redirect(StreamReader input, Action<string> logAction)
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
                        logAction(str.ToString());
                        str.Clear();
                    }
                };
            }).Start();
        }
    }
}