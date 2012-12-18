using System;
using Nancy;
using Nancy.ErrorHandling;
using log4net;

namespace AsimovDeploy.WinAgent.Web.Setup
{
    public class NancyErrorHandler : IErrorHandler
    {
        private readonly ILog _logger = LogManager.GetLogger(typeof(NancyErrorHandler));

        public bool HandlesStatusCode(HttpStatusCode statusCode, NancyContext context)
        {
            return statusCode == HttpStatusCode.InternalServerError;
        }

        public void Handle(HttpStatusCode statusCode, NancyContext context)
        {
            object errorObject;
            context.Items.TryGetValue(NancyEngine.ERROR_EXCEPTION, out errorObject);
            var error = errorObject as Exception;
            _logger.Error("Unhandled error", error);
        }
    }
}