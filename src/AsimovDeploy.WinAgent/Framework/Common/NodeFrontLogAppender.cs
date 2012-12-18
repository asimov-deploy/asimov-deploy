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