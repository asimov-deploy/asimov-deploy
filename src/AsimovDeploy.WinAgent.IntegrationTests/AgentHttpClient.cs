using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AsimovDeploy.WinAgent.IntegrationTests
{
    public class AgentHttpClient
    {
        private readonly int _port;

        public AgentHttpClient(int port)
        {
            _port = port;
        }

        public T Get<T>(string url)
        {
            var httpClient = new HttpClient();
            var result = httpClient.GetAsync(string.Format("http://localhost:{0}{1}", _port, url));
            var strTask = result.Result.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(strTask.Result);
        }

        public dynamic Get(string url)
        {
            var httpClient = new HttpClient();
            var result = httpClient.GetAsync(GetFullAgentUrl(url));
            var strTask = result.Result.Content.ReadAsStringAsync();
            return JObject.Parse(strTask.Result);
        }

        private string GetFullAgentUrl(string url)
        {
            return string.Format("http://localhost:{0}{1}", _port, url);
        }

        public void Post(string url, string apiKey, object data)
        {
            var httpClient = new HttpClient();
            var jsonString = JsonConvert.SerializeObject(data);
            var content = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var fullUrl = GetFullAgentUrl(url) + "?apiKey=" + apiKey;
            var post = httpClient.PostAsync(fullUrl, content);
            Task.WaitAll(post);
        }
    }
}