using System;
using System.Collections.Generic;
using AsimovDeploy.WinAgent.Framework.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AsimovDeploy.WinAgent.Framework.Configuration
{
    public class ActionParameterListJsonConverter : JsonConverter
    {
        public static IDictionary<string, Type> _parameterTypes = new Dictionary<string, Type>();
        
        static ActionParameterListJsonConverter()
        {
            _parameterTypes.Add("Text", typeof(TextActionParameter));
            _parameterTypes.Add("Password", typeof(PasswordParameter));
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {

        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var list = (ActionParameterList)existingValue ?? new ActionParameterList();

            var json = JObject.Load(reader);
            foreach (var jsonProperty in json)
            {
                var jObject = (JObject)jsonProperty.Value;
                var packageSourceType = _parameterTypes[jObject.Property("Type").Value.ToString()];
                var packageSource = (ActionParameter)serializer.Deserialize(jObject.CreateReader(), packageSourceType);
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