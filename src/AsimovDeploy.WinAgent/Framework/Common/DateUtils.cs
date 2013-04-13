using System;
using System.Text;

namespace AsimovDeploy.WinAgent.Framework.Common
{
	public static class DateUtils
	{
		public static string GetFriendlyAge(DateTime time)
		{
			TimeSpan diff = DateTime.Now.Subtract(time);
			int years = diff.Days/365; //no leap year accounting
			int months = (diff.Days%365)/30; //naive guess at month size
			int weeks = ((diff.Days%365)%30)/7;
			int days = (((diff.Days%365)%30)%7);

			if (years > 0)
				return Value(years, "year");
			if (months > 0)
				return Value(months, "month");
			if (weeks > 0)
				return Value(weeks, "week");
			if (days > 0)
				return Value(days, "day");
			if (diff.Hours > 0)
				return Value(diff.Hours, "hour");
			if (diff.Minutes > 0)
				return Value(diff.Minutes, "minute");
			if (diff.Seconds > 0)
				return Value(diff.Minutes, "second");

			return "";
		}

		private static string Value(int value, string name)
		{
			if (value > 1)
				return string.Format("{0} {1}s ago",value, name);
			else
				return string.Format("{0} {1} ago", value, name);
		}
	}
}