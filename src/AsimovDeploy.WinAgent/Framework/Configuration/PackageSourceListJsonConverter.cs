using System;
using System.Collections.Generic;
using AsimovDeploy.WinAgent.Framework.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AsimovDeploy.WinAgent.Framework.Configuration
{
    public class PackageSourceListJsonConverter : JsonConverter
    {
        public static IDictionary<string, Type> _sourceTypes = new Dictionary<string, Type>();


        static PackageSourceListJsonConverter()
        {
            _sourceTypes.Add("FileSystem", typeof(FileSystemPackageSource));
            _sourceTypes.Add("AsimovWeb", typeof(AsimovWebPackageSource));
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var list = (PackageSourceList)existingValue ?? new PackageSourceList();

            var json = JObject.Load(reader);
            foreach (var jsonProperty in json)
            {
                var jObject = (JObject) jsonProperty.Value;
                var packageSourceType = _sourceTypes[jObject.Property("Type").Value.ToString()];
                var packageSource = (PackageSource)serializer.Deserialize(jObject.CreateReader(), packageSourceType);
                packageSource.Name = jsonProperty.Key;

                list.Add(packageSource);
            }

            return list;
        }

        public override bool CanConvert(Type objectType)
        {
            return false;
        }
    }
}