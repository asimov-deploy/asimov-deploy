using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading;
using AsimovDeploy.WinAgent.Framework.Common;
using NUnit.Framework;

namespace AsimovDeploy.WinAgent.IntegrationTests
{
    [TestFixture]
    public abstract class WinAgentSystemTest
    {
        protected string AgentDir;
        protected string WorkingDir;
        protected string DataDir;
        protected string TempDir;
        protected string PackagesDir;
        protected string ScenarioDir;
        protected int AgentPort = 18342;
        public static string NodeFrontUrl = "http://localhost:5433/";
        protected Process AgentProcess;
        protected AgentHttpClient Agent;
        protected NodeFrontSimulator NodeFront;


        [TestFixtureSetUp]
        public void Setup()
        {
            try
            {
                ShutDownRunnningAgent();
                GivenFoldersForScenario();
                Given();
            }
            catch (Exception)
            {
                CleanUp();
                throw;
            }
        }

        private void ShutDownRunnningAgent()
        {
            while (true)
            {
                try
                {
                    var agents = Process.GetProcessesByName("AsimovDeploy.WinAgent");
                    foreach (var process in agents)
                    {
                        process.Kill();
                    }

                    break;
                }
                catch (Exception)
                {
                    Thread.Sleep(1000);
                }    
            }
        }

        [TestFixtureTearDown]
        public void CleanUp()
        {
            try
            {
                if (AgentProcess != null && !AgentProcess.HasExited)
                {
                    AgentProcess.Kill();
                }

                NodeFront.Dispose();
            }
            catch { }
            
        }

        public abstract void Given();

        public void GivenFoldersForScenario([CallerFilePath] string scenarioSourceFile = "")
        {
            ScenarioDir = Path.Combine(new FileInfo(scenarioSourceFile).Directory.FullName);

            WorkingDir = Environment.CurrentDirectory;
            AgentDir = Path.Combine(WorkingDir, "Agent");

            if (Directory.Exists(AgentDir))
                Directory.Delete(AgentDir, true);

            Directory.CreateDirectory(AgentDir);
            
            DataDir = Path.Combine(WorkingDir, "Data");
            TempDir = Path.Combine(DataDir, "Temp");
            PackagesDir = Path.Combine(ScenarioDir, "Packages");

            if (Directory.Exists(DataDir))
                Directory.Delete(DataDir, true);

            Directory.CreateDirectory(DataDir);
            Directory.CreateDirectory(TempDir);
            Directory.CreateDirectory(PackagesDir);

            Debug.WriteLine("WorkingDir = " + WorkingDir);
            Debug.WriteLine("AgentDir = " + AgentDir);
            Debug.WriteLine("DataDir = " + DataDir);
            Debug.WriteLine("TempDir = " + TempDir);
            Debug.WriteLine("PackagesDir = " + PackagesDir);
        }

        public void CopyAgentToCleanRunFolder()
        {
            DirectoryUtil.CopyDirectory(@"..\..\..\AsimovDeploy.WinAgent\bin\Debug", AgentDir);
        }

        public void GivenRunningAgent()
        {
            CopyAgentToCleanRunFolder();
            CopyConfigToAgentDir();

            NodeFront = new NodeFrontSimulator();
            NodeFront.Start();

            AgentProcess = new Process();
            AgentProcess.StartInfo.UseShellExecute = false;
            AgentProcess.StartInfo.WorkingDirectory = AgentDir;
            AgentProcess.StartInfo.FileName = Path.Combine(AgentDir, "AsimovDeploy.WinAgent.exe");
            AgentProcess.StartInfo.CreateNoWindow = true;
            AgentProcess.StartInfo.RedirectStandardError = true;
            AgentProcess.StartInfo.RedirectStandardOutput = true;
            AgentProcess.Start();

            RedirectAgentOutputToDebug(AgentProcess.StandardOutput);
            
            Thread.Sleep(5000);

            Agent = new AgentHttpClient(AgentPort);
            
            Assert.NotNull(Agent.Get("/version"));
        }

        private void CopyConfigToAgentDir()
        {
            var sourceConfigDir = Path.Combine(ScenarioDir, "ConfigFiles");
            var targetDir = Path.Combine(AgentDir, "ConfigFiles");
            DirectoryUtil.Clean(targetDir);
            DirectoryUtil.CopyDirectory(sourceConfigDir, targetDir);
            TransformConfig(targetDir);
        }

        private void TransformConfig(string configDir)
        {
            foreach (var file in Directory.EnumerateFiles(configDir))
            {
                var str = File.ReadAllText(file);
                str = str.Replace("%DATA_FOLDER%", DataDir.Replace(@"\", @"\\"));
                str = str.Replace("%NODE_FRONT_URL%", NodeFrontUrl);
                str = str.Replace("%PACKAGES_URI%", new Uri(PackagesDir).AbsoluteUri);
                str = str.Replace("%AGENT_PORT%", AgentPort.ToString());
                File.WriteAllText(file, str);
            }
        }

        private void RedirectAgentOutputToDebug(StreamReader input)
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
                        Debug.Write("[AgentOutput]: " + str);
                        Debug.Flush();
                        str.Clear();
                    }
                };

                Debug.WriteLine("[AgentOutput]: output ended");
            }).Start();
        }
    }

    //[TestFixture]
    //public class RandomFeatureTest : WinAgentSystemTest
    //{
    //    public RandomFeatureTest()
    //    {
    //        //GivenAlreadyInstalledWindowsServices();
    //        //GivenAlreadyInstalledWebSites();
    //        //GivenPackagesInFolder()

    //        GivenRunningAgent();
    //    }
    //}
}