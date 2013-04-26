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

using System.Collections.Generic;

namespace AsimovDeploy.WinAgent.Framework.Events
{
    public class VerifyProgressEvent : AsimovEvent
    {
        public bool? completed;
        public bool? started;        
		
		public string unitName;

	    public dynamic test;
		public dynamic image;
	    public dynamic report;
		
		public VerifyProgressEvent(string unitName)
		{
			this.eventName = "verify-progress";
			this.unitName = unitName;
		}
    }
}