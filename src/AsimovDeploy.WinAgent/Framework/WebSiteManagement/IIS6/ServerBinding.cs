namespace AsimovDeploy.WinAgent.Framework.WebSiteManagement.IIS6
{
    public class ServerBinding
    {
        public ServerBinding() : this(string.Empty, string.Empty, "80") { }
        public ServerBinding(string hostName, string ipAddress, string port)
        {
            this.HostName = hostName;
            this.IPAddress = ipAddress;
            this.Port = port;
        }

        public string HostName { get; set; }
        public string IPAddress { get; set; }
        public string Port { get; set; }
    }
}