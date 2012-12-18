using System.Collections.Generic;
using System.Management;

namespace AsimovDeploy.WinAgent.Framework.WebSiteManagement.IIS6
{
    /// <summary>
    /// Base object for WMI objects
    /// </summary>
    public abstract class WmiObjectBase
    {
        /// <summary>
        /// Create and connect a management scope for use by subclasses
        /// </summary>
        /// <param name="path">The management path</param>
        protected WmiObjectBase(string path)
        {
            ConnectionOptions connectionOptions = new ConnectionOptions();
            connectionOptions.Authentication = AuthenticationLevel.PacketPrivacy;
            this.Scope = new ManagementScope(path, connectionOptions);
            this.Scope.Connect();
        }

        /// <summary>
        /// Allow subclasses to pass in an existing scope
        /// </summary>
        /// <param name="scope">A management scope object</param>
        protected WmiObjectBase(ManagementScope scope)
        {
            this.Scope = scope;
            if (!this.Scope.IsConnected)
                this.Scope.Connect();
        }

        /// <summary>
        /// Let subclasses get their scope object
        /// </summary>
        protected ManagementScope Scope { get; private set; }

        /// <summary>
        /// Allow subobjects to peform queries
        /// </summary>
        /// <param name="query">The object query to perform</param>
        /// <returns>A ManagementObjectCollection containing the results of the query</returns>
        protected ManagementObjectCollection this[ObjectQuery query]
        {
            get
            {
                return new ManagementObjectSearcher(this.Scope, query).Get();
            }
        }


        /// <summary>
        /// Apply settings to a Management object.
        /// </summary>
        /// <param name="target">The ManagamentObject to apply the settings to</param>
        /// <param name="properties">A Dictionary object containing the properties and their value.</param>
        /// <remarks>
        /// The properties Dictionary contains the name of the property as the key, and the value of the property as the value.
        /// </remarks>
        protected void ApplySettings(ManagementObject target, Dictionary<string, object> properties)
        {
            foreach (var kv in properties)
            {
                target.Properties[kv.Key].Value = kv.Value;
            }
            target.Put();
        }

        /// <summary>
        /// Allow subclasses and easy method of creating new ManagementObject instances
        /// </summary>
        /// <param name="path">The management path of the object</param>
        /// <returns>The instance of the object</returns>
        protected ManagementObject CreateManagementObject(string path)
        {
            ManagementClass template = new ManagementClass(this.Scope, new ManagementPath(path), null);
            return template.CreateInstance();
        }

        /// <summary>
        /// Allow subclasses to get instances of existing objects
        /// </summary>
        /// <param name="path">the management path</param>
        /// <returns>An instance of the object</returns>
        public ManagementObject GetInstance(string path)
        {
            return new ManagementObject(this.Scope, new ManagementPath(path), null);
        }
    }
}