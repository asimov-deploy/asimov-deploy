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
using System.Linq;
using System.Threading;
using log4net.Appender;
using log4net.Core;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public class NodeFrontLogAppender : BufferingAppenderSkeleton
    {
        private NodeFrontPublisherPublisher _nodeFrontPublisherPublisher;
        private Timer _timer;

        public NodeFrontLogAppender()
        {
            _nodeFrontPublisherPublisher = new NodeFrontPublisherPublisher();
            Evaluator = new TimeEvaluator(1);
            _timer = new Timer(TimerTick, null, 0, 500);
        }

        private void TimerTick(object state)
        {
            Flush();
        }

        protected override void SendBuffer(LoggingEvent[] events)
        {
            var eventArray = events
                .Where(x => x.Level > Level.Debug)
                .Select(loggingEvent => new
                                 {
                                     agentName = Environment.MachineName,
                                     timestamp = loggingEvent.TimeStamp,
                                     time = loggingEvent.TimeStamp.ToString("hh:MM:ss"),
                                     level = loggingEvent.Level.ToString().ToLower(),
                                     message = loggingEvent.RenderedMessage,
                                     exception = loggingEvent.ExceptionObject != null ? loggingEvent.GetExceptionString() : null
                                 }).ToArray();


            _nodeFrontPublisherPublisher.Notify("/agent/log", eventArray);
        }
    }
}