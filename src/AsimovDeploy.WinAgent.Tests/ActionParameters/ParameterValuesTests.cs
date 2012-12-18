using System.Collections.Generic;
using System.Dynamic;
using AsimovDeploy.WinAgent.Framework.Models;
using NUnit.Framework;
using Newtonsoft.Json;
using Shouldly;

namespace AsimovDeploy.WinAgent.Tests.ActionParameters
{
    [TestFixture]
    public class ParameterValuesTests
    {
        [Test]
        public void can_deserialize_and_work_with_dynamic()
        {
            var parameters = new ExpandoObject();
            ((IDictionary<string, object>)parameters)["Test"] = "test value";
            
            var json = JsonConvert.SerializeObject(parameters);
            dynamic deserialized = JsonConvert.DeserializeObject<IDictionary<string, object>>(json);

            var expando = new ParameterValues(parameters);
            ((string) expando.GetValue("Test")).ShouldBe("test value");

            var fromJson = new ParameterValues(deserialized);
            ((string)fromJson.GetValue("Test")).ShouldBe("test value");
        }

        [Test]
        public void can_deserialize_and_work_with_dynamic_with_nested_types()
        {
            var parameters = new ExpandoObject();
            dynamic value = new ExpandoObject();
            value.prop1 = "test";
            value.prop2 = "test2";
            ((IDictionary<string, object>)parameters)["Test"] = value;

            var json = JsonConvert.SerializeObject(parameters);
            dynamic deserialized = JsonConvert.DeserializeObject<IDictionary<string, object>>(json);

            var expando = new ParameterValues(parameters);
            ((string)expando.GetValue("Test").prop1).ShouldBe("test");
            ((string)expando.GetValue("Test").prop2).ShouldBe("test2");

            var fromJson = new ParameterValues(deserialized);
            ((string)fromJson.GetValue("Test").prop1).ShouldBe("test");
            ((string)fromJson.GetValue("Test").prop2).ShouldBe("test2");
        }
    }
}