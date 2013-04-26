// /*******************************************************************************
// * Copyright (C) 2012 eBay Inc.
// *
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// *
// *   http://www.apache.org/licenses/LICENSE-2.0
// *
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// ******************************************************************************/

using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text.RegularExpressions;

namespace AsimovDeploy.WinAgent.Framework.Common
{
	public static class ConsoleOutputParseUtil
	{
		public static IDictionary<string, string> ParseKeyValueString(string str)
		{
			var within = str.Replace("##asimov-deploy[", "").TrimEnd(']');
			var dictionary = new Dictionary<string, string>();
			
			foreach (Match match in Regex.Matches(within, "(\\w+)='([^\']+)\'|([^\\s]+)"))
			{
				dictionary.Add(match.Groups[1].Value, match.Groups[2].Value);
			}

			return dictionary;
		}
	}
}