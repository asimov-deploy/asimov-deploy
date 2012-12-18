using System.Threading.Tasks;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public interface ITaskExecutor
    {
        Task<T> AddTask<T>(T task) where T : AsimovTask;
    }
}