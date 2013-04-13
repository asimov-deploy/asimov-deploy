using System;
using AsimovDeploy.WinAgent.Framework.Common;
using NUnit.Framework;
using Shouldly;

namespace AsimovDeploy.WinAgent.Tests.Utils
{
	[TestFixture]
	public class FriendlyAgeSpecs
	{
		[Test]
		public void Test()
		{
			DateUtils.GetFriendlyAge(DateTime.Now.Subtract(TimeSpan.FromHours(8))).ShouldBe("8 hours ago");
			DateUtils.GetFriendlyAge(DateTime.Now.Subtract(TimeSpan.FromHours(25))).ShouldBe("1 day ago");
			DateUtils.GetFriendlyAge(DateTime.Now.Subtract(TimeSpan.FromDays(8))).ShouldBe("1 week ago");
			DateUtils.GetFriendlyAge(DateTime.Now.Subtract(TimeSpan.FromDays(15))).ShouldBe("2 weeks ago");
		}
	}
}