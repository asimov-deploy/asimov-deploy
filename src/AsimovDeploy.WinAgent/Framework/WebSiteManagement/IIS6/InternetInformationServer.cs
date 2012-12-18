using System;
using System.Collections.Generic;
using System.Management;
using System.Text.RegularExpressions;

namespace AsimovDeploy.WinAgent.Framework.WebSiteManagement.IIS6
{
    public class InternetInformationServer : WmiObjectBase
    {
        /// <summary>
        /// Create an instance of the InternetInformationServer class that is connected to the
        /// local IIS instance.
        /// </summary>
        public InternetInformationServer() : base(@"\\.\root\MicrosoftIISV2") { }

        /// <summary>
        /// Create an instance of the InternetInformationServer class that is connected to the
        /// instance defined by target.
        /// </summary>
        /// <param name="target">The name of the machine to connect to.</param>
        public InternetInformationServer(string target) : base(string.Format(@"\\{0}\root\MicrosoftIISV2", target)) { }

        /// <summary>
        /// Create a new website on the IIS instance.
        /// </summary>
        /// <param name="serverComment">The server comment.</param>
        /// <param name="rootPath">The path to the root virtual directory of the web site.</param>
        /// <returns>A new WebSite instance.</returns>
        public WebSite CreateWebSite(string serverComment, string rootPath)
        {
            return this.CreateWebSite(serverComment, rootPath, new ServerBinding[] { new ServerBinding() });
        }

        /// <summary>
        /// Create a new web site on the IIS instance.
        /// </summary>
        /// <param name="serverComment">The server comment.</param>
        /// <param name="rootPath">The path to the root virtual directory of the web site.</param>
        /// <param name="serverBindings">A list of ServerBinding objects to apply to the web site.</param>
        /// <returns></returns>
        public WebSite CreateWebSite(string serverComment, string rootPath, ServerBinding[] serverBindings)
        {
            const string METHOD = "CreateNewSite";

            // create a list of serverbindings...
            List<ManagementObject> bindings = new List<ManagementObject>();
            Array.ForEach(serverBindings, binding => bindings.Add(CreateServerBinding(binding)));

            // create the site..
            ManagementObject w3svc = new ManagementObject(this.Scope, new ManagementPath(@"IISWebService='W3SVC'"), null);
            ManagementBaseObject parameters = w3svc.GetMethodParameters(METHOD);

            parameters["ServerComment"] = serverComment;
            parameters["ServerBindings"] = bindings.ToArray();
            parameters["PathOfRootVirtualDir"] = rootPath;

            ManagementBaseObject result = w3svc.InvokeMethod(METHOD, parameters, null);
            Match m = Regex.Match((string)result.Properties["ReturnValue"].Value, "'(.*?)'");

            return new WebSite(this.Scope, serverComment, m.Groups[1].Value);
        }

        /// <summary>
        /// Create a new application pool on the IIS instance
        /// </summary>
        /// <param name="name">The name of the application pool.</param>
        /// <returns></returns>
        public ApplicationPool CreateAppliationPool(string name)
        {
            ApplicationPool appPool = new ApplicationPool(this.Scope);
            appPool.Name = string.Format("W3SVC/AppPools/{0}", name);

            ManagementObject poolTemplate = CreateManagementObject("IIsApplicationPoolSetting");
            poolTemplate.Properties["Name"].Value = appPool.Name;
            poolTemplate.Put();

            return appPool;
        }

        private ManagementObject CreateServerBinding(ServerBinding binding)
        {
            ManagementObject managementObject = CreateManagementObject("ServerBinding");
            managementObject.Properties["Hostname"].Value = binding.HostName;
            managementObject.Properties["IP"].Value = binding.IPAddress;
            managementObject.Properties["Port"].Value = binding.Port;

            return managementObject;
        }

        /// <summary>
        /// Iterator of all the sites on the IIS instance.
        /// </summary>
        public IEnumerable<WebSite> Sites
        {
            get
            {
                ObjectQuery query = new ObjectQuery("SELECT * FROM IISWebServerSetting");
                foreach (ManagementObject item in this[query])
                {
                    yield return new WebSite(this.Scope, item["ServerComment"].ToString(), item["Name"].ToString());
                }
            }
        }


        /// <summary>
        /// Get a reference to an appliation pool on the IIS instance.
        /// </summary>
        /// <param name="applicationPoolId">The id of the application pool.</param>
        /// <returns>An ApplicationPool object or null if not found.</returns>
        public ApplicationPool GetApplicationPool(string applicationPoolId)
        {
            ObjectQuery query = new ObjectQuery(string.Format("SELECT * FROM IIsApplicationPoolSetting WHERE Name='W3SVC/AppPools/{0}'", applicationPoolId));
            foreach (ManagementObject item in this[query])
            {
                return new ApplicationPool(this.Scope, (string)item.Properties["Name"].Value);
            }
            return null;
        }


        /// <summary>
        /// Get a reference to an existing web site on the IIS instance based on the server comment
        /// </summary>
        /// <param name="serverComment">The server comment of the site you want to get.</param>
        /// <returns>A WebSite object or null if not found.</returns>
        /// <remarks>
        /// This method is really a special purpose method - the server comment is not required to be unique in most cases.  But,
        /// in my case it is.  If you can't guarentee uniqueness then you will either need to make this return the a list, or
        /// uses the site id rather then the server comment.
        /// </remarks>
        public WebSite GetWebSite(string serverComment)
        {
            ObjectQuery query = new ObjectQuery("SELECT * FROM IISWebServerSetting WHERE ServerComment = '" + serverComment + "'");
            foreach (ManagementObject item in this[query])
            {
                return new WebSite(this.Scope, item["ServerComment"].ToString(), item["Name"].ToString());
            }

            return null;
        }

    }
}