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
using System.IO;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Deployment;
using AsimovDeploy.WinAgent.Framework.Deployment.Steps;
using AsimovDeploy.WinAgent.Framework.Models;
using StructureMap;
using log4net.Appender;
using log4net.Layout;
using log4net.Repository.Hierarchy;

namespace AsimovDeploy.WinAgent.Framework.Tasks
{
    public class DeployTask : AsimovTask
    {
        private readonly DeployUnit _deployUnit;
        private readonly AsimovVersion _version;
        private readonly ParameterValues _parameterValues;

        private IList<Type> _steps = new List<Type>();

        public DeployTask(DeployUnit deployUnit, AsimovVersion version, ParameterValues parameterValues)
        {
            _deployUnit = deployUnit;
            _version = version;
            _parameterValues = parameterValues;

            AddDeployStep<CleanTempFolder>();
            AddDeployStep<CopyPackageToTempFolder>();
        }

        public void AddDeployStep<T>() where T : IDeployStep
        {
            _steps.Add(typeof(T));
        }

        protected virtual DeployContext CreateDeployContext()
        {
            return new DeployContext()
                {
                    DeployUnit = _deployUnit,
                    Log = Log,
                    NewVersion = _version,
                    ParameterValues = _parameterValues
                };
        }

        protected override void Execute()
        {
            if (PasswordIsIncorrect())
            {
                Log.Error("Invalid deploy password, aborting deployment");
                return;
            }


            InDeployContext(context =>
            {
                context.DeployUnit.StartingDeploy(context.NewVersion, context.LogFileName);

                Log.InfoFormat("Starting deployment of {0}, Version: {1}, {2}", _deployUnit.Name, _version.Number, _parameterValues.GetLogString());

                foreach (var stepType in _steps)
                {
                    Log.InfoFormat("Executing deploy step: {0}", stepType.Name);
                    var step = ObjectFactory.GetInstance(stepType) as IDeployStep;
                    step.Execute(context);
                }

                context.DeployUnit.DeployCompleted();

                Log.Info("Deployment completed");
            });
        }

        private bool PasswordIsIncorrect()
        {
            if (!_deployUnit.HasDeployParameters)
                return false;

            foreach (var parameter in _deployUnit.DeployParameters)
            {
                var passwordParameter = parameter as PasswordParameter;
                if (passwordParameter == null) continue;

                var suppliedPassword = _parameterValues.GetValue(passwordParameter.Name);
                return suppliedPassword != passwordParameter.Password;
            }

            return false;
        }

        private void InDeployContext(Action<DeployContext> action)
        {
            var context = CreateDeployContext();

            FileAppender fileAppender;
            var logger = CreateLogger(context, out fileAppender);

            try
            {
                action(context);
            }
            catch (Exception ex)
            {
                context.DeployUnit.DeployFailed();
                context.Log.Error("DeployFailed", ex);
            }
            finally
            {
                logger.RemoveAppender(fileAppender);
                fileAppender.Close();
            }

        }

        private Logger CreateLogger(DeployContext context, out FileAppender fileAppender)
        {
            var logger = (Logger) Log.Logger;

            fileAppender = new FileAppender();
            // update file property of appender
            context.LogFileName = string.Format("deploy-{0:yyyy-MM-dd_HH_mm_ss}.log", DateTime.Now);
            fileAppender.File = Path.Combine(context.DeployUnit.DataDirectory, "Logs", context.LogFileName);
            // add the layout
            var patternLayout = new PatternLayout("%date{HH:mm:ss} [%-5level]  %m%n");
            fileAppender.Layout = patternLayout;
            // add the filter for the log source
            // activate the options
            fileAppender.ActivateOptions();

            logger.AddAppender(fileAppender);
            return logger;
        }
    }
}