using System;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.Models.Units;
using AsimovDeploy.WinAgent.Framework.Tasks;
using log4net;

namespace AsimovDeploy.WinAgent.Framework.Models.UnitActions
{
	public class StartWebApplication : UnitAction
	{
		private static ILog _log = LogManager.GetLogger(typeof(StopWebApplication));

		public StartWebApplication()
		{
			Name = "Start";
		}

		public override AsimovTask GetTask(DeployUnit unit)
		{
			if (!(unit is WebSiteDeployUnit))
				throw new ArgumentException("Action is only supported for WebSite deploy units");

			return new LambdaTask("Stopp AppPool for " + unit.Name, () => Execute((WebSiteDeployUnit)unit));
		}

		private void Execute(WebSiteDeployUnit unit)
		{
			NodeFront.Notify(new UnitStatusChangedEvent(unit.Name, UnitStatus.Starting));

			var server = unit.GetWebServer();
			server.StartAppPool();

			var unitInfo = unit.GetUnitInfo();

			if (unitInfo.Status != UnitStatus.Running)
			{
				_log.Error("Failed to start " + unit.Name);
			}

			NodeFront.Notify(new UnitStatusChangedEvent(unit.Name, unitInfo.Status));
		}
	}
}