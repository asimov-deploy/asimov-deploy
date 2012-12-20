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
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public class ParameterValues
    {
        private readonly IDictionary<string, dynamic> _parameters;

        public ParameterValues(IDictionary<string, dynamic> parameters)
        {
            _parameters = parameters;
        }

        public dynamic GetValue(string parameterName)
        {
            if (_parameters == null)
                return null;

            return _parameters[parameterName];
        }

        public string GetLogString()
        {
            if (_parameters == null || _parameters.Count == 0)
                return "";

            var str = new StringBuilder("Parameters: {");

            foreach (var keyValue in _parameters)
            {
                if (keyValue.Key.IndexOf("password", StringComparison.OrdinalIgnoreCase) != -1)
                    continue;

                str.AppendFormat(" {0}: {1}", keyValue.Key, keyValue.Value);
            }

            str.Append(" }");

            return str.ToString();
        }
    }
}