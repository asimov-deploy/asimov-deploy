namespace AsimovDeploy.WinAgent.Framework.Events
{
    public class UnitInfoUpdatedEvent : AsimovEvent
    {
        public string unitName { get; set; }
        public bool running { get; set; }
        public string info { get; set; }
        
        public UnitInfoUpdatedEvent(string unitName, string info)
        {
            this.eventName = "unitInfoUpdated";
            this.unitName = unitName;
            this.info = info;
        }

    }
}