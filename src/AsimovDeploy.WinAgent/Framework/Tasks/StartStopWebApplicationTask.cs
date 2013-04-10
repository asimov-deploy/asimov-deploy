using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Framework.Models.Units;
using log4net;

namespace AsimovDeploy.WinAgent.Framework.Tasks
{
	public class StartStopWebApplicationTask : AsimovTask
	{
		private static ILog _log = LogManager.GetLogger(typeof(StartStopWebApplicationTask));

		private readonly WebSiteDeployUnit _unit;
		private readonly bool _stop;

		public StartStopWebApplicationTask(WebSiteDeployUnit unit, bool stop)
		{
			_unit = unit;
			_stop = stop;
		}

		protected override string InfoString()
		{
			return (_stop ? "Stopping " : "Starting ") + _unit.Name;
		}

		protected override void Execute()
		{
			var intermediateStatus = _stop ? UnitStatus.Stopping : UnitStatus.Starting;
			var endStatus = _stop ? UnitStatus.Stopped : UnitStatus.Running;

			NodeFront.Notify(new UnitStatusChangedEvent(_unit.Name, intermediateStatus));

			var server = _unit.GetWebServer();
			
			if (_stop) server.StopAppPool();
			else server.StartAppPool();

			var unitInfo = _unit.GetUnitInfo();

			if (unitInfo.Status != endStatus)
			{
				_log.Error(string.Format("Failed to {0} {1}", (_stop ? "stop" : "start"), _unit.Name));
			}

			NodeFront.Notify(new UnitStatusChangedEvent(_unit.Name, unitInfo.Status));
		}
	}
}