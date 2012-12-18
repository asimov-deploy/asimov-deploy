using System.Dynamic;
using System.Text;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class TextActionParameter : ActionParameter
    {
        public string Default { get; set; }
        
        public override dynamic GetDescriptor()
        {
            dynamic descriptor = new ExpandoObject();
            descriptor.type = "text";
            descriptor.name = Name;
            descriptor.@default = Default;
            return descriptor;
        }

        public override void ApplyToPowershellScript(StringBuilder script, dynamic value)
        {
            var scriptToInsert = string.Format("${0} = \"{1}\"\n", Name, value);
            script.Insert(0, scriptToInsert);
        }
    }
}