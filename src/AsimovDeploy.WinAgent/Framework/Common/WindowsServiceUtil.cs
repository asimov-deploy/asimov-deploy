/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

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