using System;
using System.Collections.Concurrent;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using AsimovDeploy.WinAgent.Framework.Models;
using Newtonsoft.Json;
using StructureMap;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public class NodeFrontPublisherPublisher : INodeFrontPublisher, IStartable
    {
        private static string _nodeFrontUrl;
        private Task _workerTask;
        private static BlockingCollection<NodeFrontMessage> _messages = new BlockingCollection<NodeFrontMessage>(200);

        static NodeFrontPublisherPublisher()
        {
            var config = ObjectFactory.GetInstance<IAsimovConfig>();
            _nodeFrontUrl = config.NodeFrontUrl;
        }

        public void Notify(string url, object data)
        {
            _messages.Add(new NodeFrontMessage() { Url = url, Data = data});
        }

        private void SendMessage(NodeFrontMessage message)
        {
            try
            {
                var fullUrl = new Uri(new Uri(_nodeFrontUrl), message.Url);

                var request = WebRequest.Create(fullUrl) as HttpWebRequest;
                request.Method = "POST";
                request.ContentType = "application/json";
                request.ServicePoint.Expect100Continue = false;
                request.Timeout = 3000;

                using (var requestStream = request.GetRequestStream())
                {
                    using (var writer = new StreamWriter(requestStream))
                    {
                        new JsonSerializer().Serialize(writer, message.Data);
                    }
                }

                using (var resp = request.GetResponse())
                {
                    resp.Close();
                }

            }
            catch (Exception) { }
        }

        public void Start()
        {
            _workerTask = Task.Factory.StartNew(() =>
            {
                while (!_messages.IsCompleted)
                {
                    NodeFrontMessage message = null;

                    try
                    {
                        message = _messages.Take();
                    }
                    catch (InvalidOperationException) { }

                    SendMessage(message);
                }

            }, TaskCreationOptions.LongRunning);
        }

        public void Stop()
        {
            _messages.CompleteAdding();
            _workerTask.Wait(TimeSpan.FromMinutes(5));
        }
    }

  
}