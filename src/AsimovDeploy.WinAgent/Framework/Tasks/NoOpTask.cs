using AsimovDeploy.WinAgent.Framework.Common;

namespace AsimovDeploy.WinAgent.Framework.Tasks
{
    public class NoOpTask : AsimovTask
    {
        protected override void Execute()
        {
            Log.Info("Did nothing!");
        }
    }
}