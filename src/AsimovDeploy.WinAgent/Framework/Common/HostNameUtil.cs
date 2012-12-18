using System.Net.NetworkInformation;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public static class HostNameUtil
    {
         public static string GetFullHostName()
         {
            var ipProperties = IPGlobalProperties.GetIPGlobalProperties();
            if (ipProperties.DomainName != string.Empty)
                return string.Format("{0}.{1}", ipProperties.HostName, ipProperties.DomainName);
            else
                return ipProperties.HostName;
         }
    }
}