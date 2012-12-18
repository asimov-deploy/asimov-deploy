namespace AsimovDeploy.WinAgent.Framework.Deployment
{
    public interface IDeployStep
    {
        void Execute(DeployContext context);
    }

    //public class Asd
    //{
    //    public void test()
    //    {
    //        var list = new List<IStep<DeployUnit>>();
    //        list.Add(new Step());
    //    }
    //}

    //public interface IStep
    //{
    //    void Ex(IContext<object> context);
    //}

    //public interface IStep<T> : IStep
    //{
    //    void Ex(IContext<T> asd);
    //}

    //public interface IContext<out T>
    //{
    //    T Get();
    //}

    //public class Step : IStep<WebSiteDeployUnit>
    //{
    //    public void Ex(IContext<WebSiteDeployUnit> asd)
    //    {
            
    //    }

    //    public void Ex(IContext<object> context)
    //    {
            
    //    }
    //}

    //public class Context<T> : IContext<T>
    //{
    //    private readonly T _deployUnit;

    //    public Context(T deployUnit)
    //    {
    //        _deployUnit = deployUnit;
    //    }

    //    public T Get()
    //    {
    //        return _deployUnit;
    //    }
    //}
}