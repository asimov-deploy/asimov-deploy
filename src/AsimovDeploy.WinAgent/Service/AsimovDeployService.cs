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
using StructureMap;
using log4net;
using log4net.Repository.Hierarchy;

namespace AsimovDeploy.WinAgent.Service
{
    public class AsimovDeployService : IAsimovDeployService
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(AsimovDeployService));

        public void Start()
        {
            try
            {
                ComponentRegistration.RegisterComponents();
                ComponentRegistration.ReadAndRegisterConfiguration();
                AddNodeFrontAppender();
                ComponentRegistration.StartStartableComponenters();

                var config = ObjectFactory.GetInstance<IAsimovConfig>();
                Log.InfoFormat("WinAgent Started, Version={0}, ConfigVersion={1}", VersionUtil.GetAgentVersion(), config.ConfigVersion);
            }
            catch (Exception e)
            {
                Log.Error("Error while starting AsimovDeployService", e);
                throw;
            }
        }

        private void AddNodeFrontAppender()
        {
            var hierarchy = (Hierarchy)LogManager.GetRepository();
            var appender = new NodeFrontLogAppender();
            appender.ActivateOptions();
            hierarchy.Root.AddAppender(appender);
        }

        public void Stop()
        {
            Log.Info("WinAgent Stopping");
            ComponentRegistration.StopAll();
        }
    }
}