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

using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.Models;
using Nancy.Bootstrappers.StructureMap;
using Nancy.Diagnostics;
using StructureMap;

namespace AsimovDeploy.WinAgent.Web.Setup
{
    public class CustomNancyBootstrapper : StructureMapNancyBootstrapper
    {
        protected override void ApplicationStartup(IContainer container, Nancy.Bootstrapper.IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);

            var config = container.GetInstance<IAsimovConfig>();

            pipelines.BeforeRequest.AddItemToEndOfPipeline(ctx =>
            {
                if (ctx.Request.Method == "POST")
                {
                    if (ctx.Request.Query.apiKey != config.ApiKey)
                    {
                        return 401;
                    }
                }

                return null;
            });
        }

        protected override DiagnosticsConfiguration DiagnosticsConfiguration
        {
            get { return new DiagnosticsConfiguration { Password = @"misoH0rny" }; }
        }

        protected override IContainer GetApplicationContainer()
        {
            return ObjectFactory.Container;
        }
    }
}