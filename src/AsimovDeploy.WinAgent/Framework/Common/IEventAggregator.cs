using StructureMap;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public interface IEventAggregator
    {
        void Publish<T>(T @event);
    }

    public interface IListenTo<T>
    {
        void Handle(T @event);
    }

    public class EventAggregator : IEventAggregator
    {
        public void Publish<T>(T @event)
        {
            foreach (var listener in ObjectFactory.GetAllInstances<IListenTo<T>>())
            {
                listener.Handle(@event);
            }
        }
    }
}