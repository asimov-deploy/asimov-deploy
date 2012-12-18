using System;
using System.Management;

namespace AsimovDeploy.WinAgent.Framework.WebSiteManagement.IIS6
{
    public class WebSite : WmiObjectBase
    {
        private readonly string IdentityQuery;

        internal WebSite(ManagementScope scope, string serverComment, string siteName)
            : base(scope)
        {
            this.ServerComment = serverComment;
            this.Name = siteName;
            this.IdentityQuery = string.Format("SELECT * FROM IISWebServer WHERE Name = '{0}'", this.Name);
        }

        public string ServerComment { get; set; }
        public string Name { get; set; }

        //public void Continue ()
        //{
        //}

        //public void Pause ()
        //{
        //}

        public void Start()
        {
            ServerState state = CurrentState;
            if (state == ServerState.Stopped)
            {
                ObjectQuery query = new ObjectQuery(IdentityQuery);
                foreach (ManagementObject site in this[query])
                {
                    site.InvokeMethod("Start", null);
                }
            }

        }

        public void Stop()
        {
            ServerState state = CurrentState;
            if (state == ServerState.Started)
            {
                ObjectQuery query = new ObjectQuery(IdentityQuery);
                foreach (ManagementObject site in this[query])
                {
                    site.InvokeMethod("Stop", null);
                }
            }
        }

        public WebVirtualDirectory DirectorySettings
        {
            get { return new WebVirtualDirectory(this.Scope, this.Name); }
        }

        public ServerState CurrentState
        {
            get
            {
                ObjectQuery query = new ObjectQuery(string.Format("SELECT ServerState FROM IISWebServer WHERE Name = '{0}'", this.Name));

                foreach (ManagementObject item in this[query])
                {
                    return (ServerState)Convert.ToInt32(item["ServerState"]);
                }
                throw new Exception("Can't determine server's current state");
            }
        }

        public override string ToString()
        {
            return string.Format("{0} ({1})", ServerComment, Name);
        }
    }

    public enum ServerState
    {
        Starting = 1,
        Started = 2,
        Stopping = 3,
        Stopped = 4,
        Pausing = 5,
        Paused = 6,
        Continuing = 7,
    }
}