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
	public class StopDeployUnitAction : UnitAction
	{
		private static ILog _log = LogManager.GetLogger(typeof (StopDeployUnitAction));

		public StopDeployUnitAction()
		{
			Name = "Stop";
		}

		public override AsimovTask GetTask(DeployUnit unit)
		{
			if (!(unit is ICanBeStopStarted))
				throw new ArgumentException("Action is only supported for deploy units that implement ICanBeStopStarted");

			return ((ICanBeStopStarted)unit).GetStopTask();
		}
	}
}
