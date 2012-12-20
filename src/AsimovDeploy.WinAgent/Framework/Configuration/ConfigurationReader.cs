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

using System.IO;
using AsimovDeploy.WinAgent.Framework.Models;
using Newtonsoft.Json;

namespace AsimovDeploy.WinAgent.Framework.Configuration
{
    public class ConfigurationReader
    {
         public IAsimovConfig Read(string configDir, string machineName)
         {
             using (var reader = new StreamReader(Path.Combine(configDir, "config.json")))
             {
                 using (var jsonReader = new JsonTextReader(reader))
                 {
                     var serializer = new JsonSerializer();
                     serializer.Converters.Add(new AsimovConfigConverter(machineName, configDir));
                     var config = serializer.Deserialize<AsimovConfig>(jsonReader);

                     if (!Directory.Exists(config.DataFolder))
                        Directory.CreateDirectory(config.DataFolder);

                     var unitsDataBaseDir = Path.Combine(config.DataFolder, "Units");
                     if (!Directory.Exists(unitsDataBaseDir))
                         Directory.CreateDirectory(unitsDataBaseDir);

                     foreach (var deployUnit in config.Units)
                     {
                         var unitDataDir = Path.Combine(unitsDataBaseDir, deployUnit.Name);
                         if (!Directory.Exists(unitDataDir))
                             Directory.CreateDirectory(unitDataDir);

                         deployUnit.DataDirectory = unitDataDir;
                     }

                     return config;
                 }
             }
         }
    }
}