using System.Collections.Generic;
using System.Management;
using System.Text.RegularExpressions;

namespace AsimovDeploy.WinAgent.Framework.WebSiteManagement.IIS6
{
    public class WebVirtualDirectory : WmiObjectBase
    {
        internal WebVirtualDirectory(ManagementScope scope, string siteName)
            : base(scope)
        {
            this.Path = string.Format("IIsWebVirtualDirSetting='{0}/ROOT'", siteName);
        }

        public string Path { get; set; }

        public void SetFrameworkVersion(string version)
        {
            ManagementObject root = this.GetInstance(this.Path);
            foreach (PropertyData property in root.Properties)
            {
                if (property.Name == "ScriptMaps")
                {
                    ManagementBaseObject[] scriptMaps = (ManagementBaseObject[])property.Value;
                    foreach (ManagementBaseObject scriptMap in scriptMaps)
                    {
                        string value = (string)scriptMap["ScriptProcessor"];
                        if (value.ToLower().Contains("framework"))
                        {
                            if (!value.Contains(version))
                            {
                                string currentVersion = Regex.Match(value, @"(v\d+\.\d+\.\d+)").Value;
                                value = value.Replace(currentVersion, version);
                                scriptMap.SetPropertyValue("ScriptProcessor", value);
                            }
                            else
                            {
                                return;
                            }
                        }
                    }

                    property.Value = scriptMaps;
                    root.Put();
                    break;
                }
            }
        }

        public void ApplySettings(Dictionary<string, object> properties)
        {
            ManagementObject root = this.GetInstance(this.Path);
            ApplySettings(root, properties);
        }
    }
}