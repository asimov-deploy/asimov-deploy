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