using System;
using System.IO;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Models;
using NUnit.Framework;
using Shouldly;

namespace AsimovDeploy.WinAgent.Tests
{
    [TestFixture]
    public class VersionLogSpecs
    {
        [SetUp]
        public void Setup()
        {
            File.Delete(".\\version-log.json");
        }

        [Test]
        public void current_version_should_return_zero_when_no_verison_file_exists()
        {
            var version = VersionUtil.GetCurrentVersion(".");
            version.VersionNumber.ShouldBe("0.0.0.0");
        }

        [Test]
        public void after_adding_version_it_should_be_persisted()
        {
            var timestamp = DateTime.Now;
            VersionUtil.UpdateVersionLog(".", new DeployedVersion()
                                                  {
                                                      VersionBranch = "master",
                                                      VersionCommit = "123",
                                                      VersionTimestamp = timestamp,
                                                      VersionId = "theId",
                                                      VersionNumber = "v1.2.3.4",
                                                      LogFileName = "logfile.txt"
                                                  });

            var log = VersionUtil.ReadVersionLog(".");
            log[0].VersionBranch.ShouldBe("master");
            log[0].VersionCommit.ShouldBe("123");
            log[0].VersionTimestamp.ShouldBe(timestamp);
            log[0].VersionId.ShouldBe("theId");
            log[0].VersionNumber.ShouldBe("v1.2.3.4");
        }

        [Test]
        public void can_add_multiple_versions_to_log()
        {
            var timestamp = DateTime.Now;
            VersionUtil.UpdateVersionLog(".", new DeployedVersion()
                                                  {
                                                      VersionBranch = "master",
                                                      VersionCommit = "123",
                                                      VersionTimestamp = timestamp,
                                                      VersionId = "theId",
                                                      VersionNumber = "v1.2.3.4",
                                                      LogFileName = "logfile.txt"
                                                  });

            VersionUtil.UpdateVersionLog(".", new DeployedVersion()
                                                  {
                                                      VersionBranch = "production",
                                                      VersionCommit = "222",
                                                      VersionTimestamp = timestamp,
                                                      VersionId = "theId2",
                                                      VersionNumber = "v1.2.3.5",
                                                      LogFileName = "logfile.txt"
                                                  });

            var log = VersionUtil.ReadVersionLog(".");
            log[0].VersionBranch.ShouldBe("production");
            log[0].VersionCommit.ShouldBe("222");
            log[0].VersionTimestamp.ShouldBe(timestamp);
            log[0].VersionId.ShouldBe("theId2");
            log[0].VersionNumber.ShouldBe("v1.2.3.5");
        }
        
    }
}