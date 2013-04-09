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
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.Models.Units;
using AsimovDeploy.WinAgent.Framework.Tasks;
using log4net;

namespace AsimovDeploy.WinAgent.Framework.Models.UnitActions
{
	public class StopWebApplication : UnitAction
	{
		private static ILog _log = LogManager.GetLogger(typeof (StopWebApplication));

		public StopWebApplication()
		{
			Name = "Stop";
		}

		public override AsimovTask GetTask(DeployUnit unit)
		{
			if (!(unit is WebSiteDeployUnit))
				throw new ArgumentException("Action is only supported for WebSite deploy units");

			return new LambdaTask("Stopp AppPool for " + unit.Name, () => Execute((WebSiteDeployUnit)unit));
		}

		private void Execute(WebSiteDeployUnit unit)
		{
			NodeFront.Notify(new UnitStatusChangedEvent(unit.Name, UnitStatus.Stopping));

			var server = unit.GetWebServer();
			server.StopAppPool();

			var unitInfo = unit.GetUnitInfo();

			if (unitInfo.Status != UnitStatus.Stopped)
			{
				_log.Error("Failed to stop " + unit.Name);
			}

			NodeFront.Notify(new UnitStatusChangedEvent(unit.Name, unitInfo.Status));
		}
	}
}
