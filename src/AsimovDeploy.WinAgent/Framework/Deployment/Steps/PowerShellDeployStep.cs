using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading;
using AsimovDeploy.WinAgent.Framework.Configuration;
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
                p.StartInfo.WorkingDirectory = _config.TempFolder;
                p.StartInfo.FileName = @"C:\Windows\system32\WindowsPowerShell\v1.0\powershell.exe";
                p.StartInfo.CreateNoWindow = true;

                p.StartInfo.Arguments = string.Format("-NoProfile -ExecutionPolicy Unrestricted -File asimov_generated.ps1");

                p.Start();

                Redirect(p.StandardOutput, context);
                
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

        private void Redirect(StreamReader input, DeployContext context)
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
                        context.Log.Info(str);
                        str.Clear();
                    }
                };

                context.Log.Info("Powershell script output ended");
            }).Start();
        }
    }
}