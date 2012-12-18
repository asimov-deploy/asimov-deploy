using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AsimovDeploy.WinAgent.IntegrationTests
{
    public class NodeFrontSimulator : IDisposable
    {
        private HttpListener _listener;
        private Dictionary<string, Action<dynamic>> _handlers;
        public string ApiKey { get; set; }
        
        public void Start()
        {
            _listener = new HttpListener();
            _listener.Prefixes.Add(WinAgentSystemTest.NodeFrontUrl);
            _listener.Start();

            _handlers = new Dictionary<string, Action<dynamic>>();
            _handlers.Add("/agent/heartbeat", data =>
                {
                    ApiKey = data.apiKey;
                });


            Task.Factory.StartNew(() =>
                {
                    while (_listener.IsListening)
                    {
                        var context = _listener.GetContext();

                        Action<dynamic> handler = null;
                        dynamic data = null;
                        
                        _handlers.TryGetValue(context.Request.Url.PathAndQuery, out handler);
                        
                        using (var streamReader = new StreamReader(context.Request.InputStream))
                        {
                            var str = streamReader.ReadToEnd();
                            if (context.Request.ContentType == "application/json")
                            {
                                try
                                {
                                    data = JObject.Parse(str);
                                }
                                catch (Exception ex)
                                {
                                }
                                
                            }
                        }

                        if (handler != null)
                        {
                            handler(data);
                        }
                        context.Response.Close();
                    }
                });
         
        }

        public void Dispose()
        {
            _listener.Stop();
        }
    }
}