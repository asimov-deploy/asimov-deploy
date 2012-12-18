using System.IO;
using System.Management;
using System.Text.RegularExpressions;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public static class WindowsServiceUtil
    {
        public static string GetWindowsServicePath(string serviceName)
        {
            WqlObjectQuery wqlObjectQuery = new WqlObjectQuery(string.Format("SELECT * FROM Win32_Service WHERE Name = '{0}'", serviceName));
            ManagementObjectSearcher managementObjectSearcher = new ManagementObjectSearcher(wqlObjectQuery);
            ManagementObjectCollection managementObjectCollection = managementObjectSearcher.Get();

            foreach (ManagementObject managementObject in managementObjectCollection)
            {
                var path = managementObject.GetPropertyValue("PathName").ToString();
                var serviceExe = Regex.Match(path, "([^\"])+").Groups[0].Value;

                var fileInfo = new FileInfo(serviceExe);
                return fileInfo.Directory.FullName;
            }

            return null;
        }
    }
}