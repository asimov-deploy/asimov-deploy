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

namespace AsimovDeploy.WinAgent.Framework.Models
{
	public abstract class UnitAction
	{
		
	}
	
	public class UrlVerifyAction
	{
		public IList<string> Urls { get; set; }
		
	}
}
