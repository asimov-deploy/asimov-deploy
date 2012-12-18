using System.Dynamic;
using System.Text;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class PasswordParameter : ActionParameter
    {
        public string Password { get; set; }

        public override dynamic GetDescriptor()
        {
            dynamic descriptor = new ExpandoObject();
            descriptor.type = "password";
            descriptor.name = Name;
            descriptor.@default = "";
            return descriptor;
        }

        public override void ApplyToPowershellScript(StringBuilder script, dynamic value)
        {
            
        }
    }
}