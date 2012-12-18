using System;

namespace AsimovDeploy.WinAgent.Framework.Deployment
{
    [Serializable]
    public class DeployException : Exception
    {
        public DeployException(string message) : base(message)
        {
        }

        public DeployException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}