using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Threading;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Web.Commands;
using AsimovDeploy.WinAgent.Web.Contracts;
using NUnit.Framework;
using Shouldly;

namespace AsimovDeploy.WinAgent.IntegrationTests.Scenarios.Powershell
{
    [TestFixture]
    public class PowershellScenario : WinAgentSystemTest
    {
        public override void Given()
        {
            GivenFoldersForScenario();
            GivenRunningAgent();
        }

        [Test]
        public void can_get_deploy_unit_info()
        {
            var units = Agent.Get<List<DeployUnitInfoDTO>>("/units/list");
            units.Count.ShouldBe(1);
            units[0].name.ShouldBe("PSTest");
            units[0].status.ShouldBe("NA");
            units[0].url.ShouldBe(string.Format("http://{0}:2121", HostNameUtil.GetFullHostName()));
            units[0].hasDeployParameters.ShouldBe(true);
        }

        [Test]
        public void can_get_deploy_parameters()
        {
            var parameters = Agent.Get<List<dynamic>>("/units/deploy-parameters/PSTest");
            parameters.Count.ShouldBe(1);
            ((string)parameters[0].name).ShouldBe("Tasks");
            ((string)parameters[0].type).ShouldBe("text");
            ((string)parameters[0].@default).ShouldBe("Deploy-Everything");
        }

        [Test]
        public void can_deploy_powershell_unit()
        {
            var versions = Agent.Get<List<DeployUnitVersionDTO>>("/versions/PSTest");
            versions.Count.ShouldBe(1);

            var parameters = new Dictionary<string, object>();
            parameters["Tasks"] = "some text value";
            
            Agent.Post("/deploy/deploy", NodeFront.ApiKey, new DeployCommand
                {
                    unitName = "PSTest",
                    versionId = versions[0].id,
                    parameters = parameters
                });

            Thread.Sleep(2000);

            File.Exists(Path.Combine(TempDir, "some.txt")).ShouldBe(true);
            File.Exists(Path.Combine(TempDir, "text.txt")).ShouldBe(true);
            File.Exists(Path.Combine(TempDir, "value.txt")).ShouldBe(true);

            var units = Agent.Get<List<DeployUnitInfoDTO>>("/units/list");;
            units[0].version.ShouldBe("1.0.0.0");
            units[0].branch.ShouldBe("master");

            var deployLog = Agent.Get<List<dynamic>>("/deploylog/list/PSTest");
            deployLog.Count.ShouldBe(1);
            ((string)deployLog[0].version).ShouldBe("1.0.0.0");
            ((string)deployLog[0].status).ShouldBe("Success");
            ((string)deployLog[0].branch).ShouldBe("master");
            ((int)deployLog[0].position).ShouldBe(0);
        }
    }
}