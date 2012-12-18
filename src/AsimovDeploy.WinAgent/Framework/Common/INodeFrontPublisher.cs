namespace AsimovDeploy.WinAgent.Framework.Common
{
    public interface INodeFrontPublisher
    {
        void Notify(string url, object data);
    }
}