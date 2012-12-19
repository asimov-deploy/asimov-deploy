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
using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.Models;
using StructureMap;
using log4net;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public abstract class AsimovTask
    {
        protected ILog Log;

        protected AsimovTask()
        {
            Log = LogManager.GetLogger(GetType());
        }

        protected abstract void Execute();

        protected virtual string InfoString()
        {
            return "";
        }

        public event Action<Exception> Completed;

        public void ExecuteTask()
        {
            try
            {
                Log.InfoFormat("Executing {0} - {1}", GetType().Name, InfoString());
                Execute();
                RaiseExecuted(null);
            }
            catch (Exception ex)
            {
                Log.Error("Task failed", ex);
                RaiseExecuted(ex);
            }
        }

        public void RaiseExecuted(Exception exception)
        {
            if (Completed != null)
                Completed(exception);
        }

        private IAsimovConfig _config;
        protected virtual IAsimovConfig Config
        {
            get
            {
                if (_config == null)
                    _config = ObjectFactory.GetInstance<IAsimovConfig>();

                return _config;
            }
        }

        protected virtual void AddTask(AsimovTask task)
        {
            ObjectFactory.GetInstance<ITaskExecutor>().AddTask(task);
        }
    }
}