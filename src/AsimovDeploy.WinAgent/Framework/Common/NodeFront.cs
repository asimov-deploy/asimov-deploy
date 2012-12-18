using AsimovDeploy.WinAgent.Framework.Events;
using StructureMap;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public static class NodeFront
    {
         public static void Notify(AsimovEvent evt)
         {
             var nodeFront = ObjectFactory.GetInstance<INodeFrontPublisher>();
             nodeFront.Notify("/agent/event", evt);
         }
    }
}