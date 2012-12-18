using System;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.Models;
using Nancy.Hosting.Self;
using log4net;

namespace AsimovDeploy.WinAgent.Web.Setup
{
    public class WebServerStartup : IStartable
    {
        public static ILog _log = LogManager.GetLogger(typeof (WebServerStartup));
        private readonly IAsimovConfig _config;
        private NancyHost _nancyHost;

        public WebServerStartup(IAsimovConfig config)
        {
            _config = config;
        }

        public void Start()
        {
            var uri1 = _config.WebControlUrl;
            var uri2 = new Uri(string.Format("http://localhost:{0}", _config.WebPort));

            _nancyHost = new NancyHost(new CustomNancyBootstrapper(), uri1, uri2);
            _nancyHost.Start();

            _log.DebugFormat("Web server started on port {0}", _config.WebPort);
        }

        public void Stop()
        {
            _nancyHost.Stop();   
        }
        
    }
}