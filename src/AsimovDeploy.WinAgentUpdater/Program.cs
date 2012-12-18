using Topshelf;
using log4net;

namespace AsimovDeploy.WinAgentUpdater
{
    class Program
    {
        public static ILog _log = LogManager.GetLogger(typeof(Program));

        private const string ServiceName = "AsimovDeploy.WinAgentUpdater";
        
        static void Main(string[] args)
        {
            log4net.Config.XmlConfigurator.Configure();

            var host = HostFactory.New(x =>
            {
                x.BeforeStartingServices(s => _log.InfoFormat("Starting {0}...", ServiceName));
                x.AfterStoppingServices(s => _log.InfoFormat("Stopping {0}...", ServiceName));

                x.Service<Updater>(s =>
                {
                    s.SetServiceName(ServiceName);
                    s.ConstructUsing(name => new Updater());

                    s.WhenStarted(tc => tc.Start());
                    s.WhenStopped(tc => tc.Stop());
                });

                x.RunAsLocalSystem();

                x.SetDisplayName(ServiceName);
                x.SetDescription(ServiceName);
                x.SetServiceName(ServiceName);
            });

            host.Run();

            
        }
    }
}
