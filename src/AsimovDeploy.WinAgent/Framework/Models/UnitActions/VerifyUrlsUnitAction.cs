/*
 * Created by SharpDevelop.
 * User: Torkel
 * Date: 2013-04-05
 * Time: 10:29
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Collections.Generic;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Tasks;

namespace AsimovDeploy.WinAgent.Framework.Models
{
	public class VerifyUrlsUnitAction : UnitAction
	{
		public IList<string> Urls { get; set; }		
		
		public override AsimovTask GetTask(DeployUnit unit)
		{
			return new VerifySiteTask((WebSiteDeployUnit)unit);
		}
	}
}
