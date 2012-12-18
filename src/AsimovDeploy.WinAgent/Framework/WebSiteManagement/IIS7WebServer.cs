using System;
using System.Linq;
using System.Threading;
using Microsoft.Web.Administration;
using log4net;

namespace AsimovDeploy.WinAgent.Framework.WebSiteManagement
{
    public class IIS7WebServer : IWebServer
    {
        private static ILog _log = LogManager.GetLogger(typeof(IIS7WebServer));

        private readonly string _siteName;
        private readonly string _appPath;
        
        public IIS7WebServer(string siteName, string siteUrl)
        {
            _siteName = siteName;

            if (siteUrl.EndsWith("/"))
                siteUrl = siteUrl.TrimEnd('/');

            _appPath = new Uri(siteUrl).AbsolutePath;
        }

        public void StartAppPool()
        {
            using (var serverManager = new ServerManager())
            {
                var site = serverManager.Sites.Single(x => x.Name == _siteName);
                
                var webApp = site.Applications.Single(x => x.Path == _appPath);
                var appPool = serverManager.ApplicationPools[webApp.ApplicationPoolName];
                
                appPool.Start();
            }
        }

        public void StopAppPool()
        {
            using (var serverManager = new ServerManager())
            {
                var site = serverManager.Sites.Single(x => x.Name == _siteName);

                var rootApp = site.Applications.Single(x => x.Path == _appPath);
                var appPool = serverManager.ApplicationPools[rootApp.ApplicationPoolName];

                if (appPool.State == ObjectState.Started) 
                    appPool.Stop();
                
                do
                {
                    Thread.Sleep(500);
                } while (appPool.State == ObjectState.Stopping);
            }
        }

        public WebSiteData GetInfo()
        {
            using (var serverManager = new ServerManager())
            {
                var site = serverManager.Sites.SingleOrDefault(x => x.Name == _siteName);
                if (site == null)
                {
                    _log.ErrorFormat("Website not found: {0}", _siteName);
                    return null;
                }

                var webApp = site.Applications.SingleOrDefault(x => x.Path == _appPath);
                if (webApp == null)
                {
                    _log.ErrorFormat("Application {0} under site {1} not found", _appPath, _siteName);
                    return null;
                }

                var vdir = webApp.VirtualDirectories.SingleOrDefault(x => x.Path == "/");
                if (vdir == null)
                {
                    _log.ErrorFormat("Application {0} does not have default '/' virtual directory", _appPath);
                    return null;
                }

                var state = ObjectState.Started;

                // accessing state for WCF AppFabric sites causes com Exception
                try { state = site.State; } catch { }

                return new WebSiteData()
                           {
                               SiteStarted = state == ObjectState.Started,
                               AppPoolStarted = serverManager.ApplicationPools[webApp.ApplicationPoolName].State == ObjectState.Started,
                               PhysicalPath = vdir.PhysicalPath,
                               AppPoolName = webApp.ApplicationPoolName
                           };
            }
        }
    }
}