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