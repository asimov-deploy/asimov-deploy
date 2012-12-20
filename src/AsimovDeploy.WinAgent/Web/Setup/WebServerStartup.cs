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