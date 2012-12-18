namespace AsimovDeploy.WinAgent.Framework.Events
{
    public class VerifyProgressEvent : AsimovEvent
    {
        public bool completed;
        public bool started;
        public bool pass;
        
        public string unitName;
        public string message;

        public VerifyProgressEvent()
        {
            this.eventName = "verify-progress";
        }
    }
}