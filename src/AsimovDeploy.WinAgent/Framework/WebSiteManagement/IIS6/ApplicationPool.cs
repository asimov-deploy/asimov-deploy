using System.Management;

namespace AsimovDeploy.WinAgent.Framework.WebSiteManagement.IIS6
{
    public class ApplicationPool : WmiObjectBase
    {
        internal ApplicationPool(ManagementScope scope)
            : base(scope)
        {
        }

        internal ApplicationPool(ManagementScope scope, string name)
            : base(scope)
        {
            this.Name = name;
        }

        public string Name { get; internal set; }
    }
}