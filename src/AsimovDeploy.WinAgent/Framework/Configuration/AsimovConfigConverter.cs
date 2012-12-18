using System;
using System.IO;
using AsimovDeploy.WinAgent.Framework.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using log4net;

namespace AsimovDeploy.WinAgent.Framework.Configuration
{
    public class AsimovConfigConverter : JsonConverter
    {
        private static ILog Log = LogManager.GetLogger(typeof (AsimovConfigConverter));
        
        private readonly string _configDir;
        private readonly string _machineName;

        public AsimovConfigConverter(string machineName, string configDir)
        {
            _configDir = configDir;
            _machineName = machineName.ToLower();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {

        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JObject json = JObject.Load(reader);

            var config = new AsimovConfig();
            serializer.Populate(json.CreateReader(), config);

            var self = GetSelf(json);
            if (self != null)
            {
                serializer.Populate(self.CreateReader(), config);
            }
            else
            {
                Log.ErrorFormat("Could not find agent specific config / environment for: {0}", _machineName);
            }
            
            var envConfigFile = Path.Combine(_configDir, string.Format("config.{0}.json", config.Environment));

            if (!File.Exists(envConfigFile))
                return config;

            Log.DebugFormat("Loading config file {0}", envConfigFile);

            using (var envReader = new StreamReader(envConfigFile))
            {
                using (var envJsonReader = new JsonTextReader(envReader))
                {
                    serializer.Populate(envJsonReader, config);
                }
            }

            return config;
        }

        private JToken GetSelf(JObject json)
        {
            var agents = json["Agents"];
            if (agents == null)
                return null;

            return json["Agents"][_machineName];
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof (AsimovConfig);
        }
    }
}