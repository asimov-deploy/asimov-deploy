namespace AsimovDeploy.WinAgent.Framework.Models
{
    public enum UnitStatus
    {
        NA = 0, 
        NotFound = 1,
        Running = 2,
        Stopped = 3
    }

    public enum DeployStatus
    {
        NA = 0,
        Deploying = 1,
        DeployFailed = 2
    }
}