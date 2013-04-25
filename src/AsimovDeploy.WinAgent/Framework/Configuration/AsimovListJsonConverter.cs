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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AsimovDeploy.WinAgent.Framework.Configuration
{
	public class AsimovListJsonConverter : JsonConverter
	{
	    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
	    {
	
	    }
	
	    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
	    {        	
	    	var list = existingValue ?? Activator.CreateInstance(objectType);
	    	var types = GetTypesForList(objectType);
	
	        var json = JObject.Load(reader);
	        foreach (var jsonProperty in json)
	        {
	            var jObject = (JObject)jsonProperty.Value;
	            var itemType = types[jObject.Property("Type").Value.ToString()];
	            var itemInstance = (dynamic)serializer.Deserialize(jObject.CreateReader(), itemType);
	            itemInstance.Name = jsonProperty.Key;
	
	            ((dynamic)list).Add(itemInstance);
	        }
	
	        return list;
	    }
	    
		private IDictionary<string, Type> GetTypesForList(Type objectType)
		{
			var typeLookup = new Dictionary<string, Type>();
			var attributes = objectType.GetCustomAttributes(typeof(AsimovListTypeAttribute), false);
			
			foreach (AsimovListTypeAttribute attr in attributes)
			{
				typeLookup.Add(attr.Name, attr.Type);
			}
			
			return typeLookup;
		}
	
	    public override bool CanConvert(Type objectType)
	    {
	        return false;
	    }
	}
	

}
