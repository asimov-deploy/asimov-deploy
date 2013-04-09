using System;
using System.ServiceProcess;
using System.Threading;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Framework.Models.Units;
using log4net;

namespace AsimovDeploy.WinAgent.Framework.Tasks
{
	public class StartStopWindowsServiceTask : AsimovTask
	{
		private static ILog _log = LogManager.GetLogger(typeof(StartStopWindowsServiceTask));

		private readonly WindowsServiceDeployUnit _unit;
		private readonly bool _stop;

		public StartStopWindowsServiceTask(WindowsServiceDeployUnit unit, bool stop)
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

			using (var controller = new ServiceController(_unit.ServiceName))
			{
				if (_stop) StopService(controller);
				else StartService(controller);

			}

			var unitInfo = _unit.GetUnitInfo();

			if (unitInfo.Status != endStatus)
			{
				_log.Error(string.Format("Failed to {0} {1}", (_stop ? "stop" : "start"), _unit.Name));
			}

			NodeFront.Notify(new UnitStatusChangedEvent(_unit.Name, unitInfo.Status));
		}

		private void StartService(ServiceController controller)
		{
			controller.Start();
			controller.WaitForStatus(ServiceControllerStatus.Running, TimeSpan.FromMinutes(2));
		}

		private static void StopService(ServiceController controller)
		{
			if (controller.Status == ServiceControllerStatus.Running)
				controller.Stop();

			controller.WaitForStatus(ServiceControllerStatus.Stopped, TimeSpan.FromMinutes(10));
			Thread.Sleep(2500);
		}
	}
}