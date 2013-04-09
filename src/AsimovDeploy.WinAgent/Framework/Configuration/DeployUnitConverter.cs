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
using System.Collections.Generic;
using AsimovDeploy.WinAgent.Framework.Models;
using AsimovDeploy.WinAgent.Framework.Models.Units;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AsimovDeploy.WinAgent.Framework.Configuration
{
    public class DeployUnitConverter : JsonConverter
    {
        public static IDictionary<string, Type> _deployUnitLookup;

        static DeployUnitConverter()
        {
            _deployUnitLookup = new Dictionary<string, Type>();
            _deployUnitLookup.Add("WebSite", typeof(WebSiteDeployUnit));
            _deployUnitLookup.Add("IIS6WebSite", typeof(IIS6WebSiteDeployUnit));
            _deployUnitLookup.Add("WindowsService", typeof(WindowsServiceDeployUnit));
            _deployUnitLookup.Add("PowerShell", typeof(PowerShellDeployUnit));
            _deployUnitLookup.Add("FileCopy", typeof(FileCopyDeployUnit));
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) { }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var list = (DeployUnits)existingValue;

            foreach (JObject jsonUnit in JArray.Load(reader))
            {
                var type = jsonUnit.Property("Type");
                var deployUnitType = _deployUnitLookup[type.Value.ToString()];
                var deployUnit = (DeployUnit) serializer.Deserialize(jsonUnit.CreateReader(), deployUnitType);

                if (deployUnit.IsValidForAgent(Environment.MachineName.ToLower()))
                {
                    list.Add(deployUnit);
                }
            }

            return existingValue;
        }

        public override bool CanConvert(Type objectType)
        {
            return false;
        }
    }
}