using System;
using System.Net;
using System.Text;
using System.Threading;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.Models;
using log4net;
using Newtonsoft.Json;

namespace AsimovDeploy.WinAgent.Framework.Heartbeat
{
    public class HeartbeatService : IStartable
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(HeartbeatService));
        private Timer _timer;
        private readonly Uri _nodeFrontUri;
        private readonly int _intervalMs;
        private readonly string _hostControlUrl;
        private readonly IAsimovConfig _config;

        public HeartbeatService(IAsimovConfig config)
        {
            _config = config;
            _nodeFrontUri = new Uri(new Uri(config.NodeFrontUrl), "/agent/heartbeat");
            _intervalMs = config.HeartbeatIntervalSeconds*1000;
            _hostControlUrl = config.WebControlUrl.ToString();
            _config = config;
            _config.ApiKey = Guid.NewGuid().ToString();
        }

        public void Start()
        {
            _timer = new Timer(TimerTick, null, 0, _intervalMs);
        }
        
        public void Stop()
        {
            _timer.Dispose();
        }

        private void TimerTick(object state)
        {
            _timer.Change(Timeout.Infinite, Timeout.Infinite);

            try
            {
                SendHeartbeat();
            }
            finally
            {
                _timer.Change(_intervalMs, _intervalMs);
            }
        }

        private void SendHeartbeat()
        {
            HttpPostJsonUpdate(_nodeFrontUri, new HeartbeatDTO
            {
                name = Environment.MachineName,
                url = _hostControlUrl,
                apiKey = _config.ApiKey,
                version = VersionUtil.GetAgentVersion(),
                configVersion = _config.ConfigVersion,
                loadBalancerId = _config.LoadBalancerId
            });
        }

        private static void HttpPostJsonUpdate<T>(Uri uri, T data)
        {
            var webRequest = (HttpWebRequest)WebRequest.Create(uri);
            webRequest.ContentType = "application/json";
            webRequest.Method = "POST";
            webRequest.KeepAlive = true;
            webRequest.Timeout = 5000;
            webRequest.ReadWriteTimeout = 5000;

            var parameters = JsonConvert.SerializeObject(data);
            var bytes = Encoding.UTF8.GetBytes(parameters);
            try
            {
                webRequest.ContentLength = bytes.Length;
                var os = webRequest.GetRequestStream();
                os.Write(bytes, 0, bytes.Length);
            }
            catch (WebException e)
            {
                Log.Warn("Error sending heartbeat to NodeFront", e);
            }
        }
    }

    public class HeartbeatDTO
    {
        public string name;
        public string url;
        public string apiKey;
        public int loadBalancerId;
        public string version;
        public int configVersion;
    }
}