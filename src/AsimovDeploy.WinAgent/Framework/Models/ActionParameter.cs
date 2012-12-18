using System.Text;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public abstract class ActionParameter
    {
        public string Name { get; set; }

        public abstract dynamic GetDescriptor();

        public abstract void ApplyToPowershellScript(StringBuilder script, dynamic value);
    }
}