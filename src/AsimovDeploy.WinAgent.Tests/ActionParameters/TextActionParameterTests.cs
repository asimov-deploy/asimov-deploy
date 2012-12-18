using System.Text;
using AsimovDeploy.WinAgent.Framework.Models;
using NUnit.Framework;
using Shouldly;

namespace AsimovDeploy.WinAgent.Tests.ActionParameters
{
    [TestFixture]
    public class TextActionParameterTests
    {
        private TextActionParameter _textParam;

        [TestFixtureSetUp]
        public void Arrange()
        {
            _textParam = new TextActionParameter();
            _textParam.Default = "testing value";
            _textParam.Name = "tasks";
        }

         [Test]
         public void can_get_descriptor()
         {
             var descriptor = _textParam.GetDescriptor();
             ((string) descriptor.name).ShouldBe("tasks");
             ((string) descriptor.type).ShouldBe("text");
             ((string) descriptor.@default).ShouldBe("testing value");
         }

        [Test]
        public void can_apply_to_powershell_script()
        {
            var script = new StringBuilder();
            _textParam.ApplyToPowershellScript(script, "some value");
            script.ToString().ShouldContain("$tasks = \"some value\"");
        }
    }
}