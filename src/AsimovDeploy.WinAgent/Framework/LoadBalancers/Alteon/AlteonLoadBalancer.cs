/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;

namespace AsimovDeploy.WinAgent.Framework.LoadBalancers.Alteon
{
    public class AlteonLoadBalancer : ILoadBalancer
    {
        private readonly ILoadBalancerSettings _settings;
        private Connection _connection;

        public AlteonLoadBalancer(ILoadBalancerSettings settings)
        {
            _settings = settings;
        }

        public void Login()
        {
            _connection = new Connection(_settings);

            _connection.ReadUntil("Enter password: ");
            _connection.WriteLine(_settings.Password);
            _connection.ReadUntil(">>");
        }

        private readonly Regex _hostListPattern = new Regex(@"(\d+):\s+(.+?)\s+(\S+)");
        public HostStatus[] GetHostList()
        {
            _connection.WriteLine("/oper/slb/cur");
            var hostList = _connection.ReadUntil(">>");

            var match = _hostListPattern.Match(hostList);

            var result = new List<HostStatus>();
            while (match.Success)
            {
                var host = new HostStatus
                {
                    id = Int32.Parse(match.Groups[1].Value),
                    name = match.Groups[2].Value,
                    enabled = match.Groups[3].Value == "enabled"
                };
                result.Add(host);
                match = match.NextMatch();
            }
            return result.ToArray();
        }

        public HostStatus GetHostStatusById(int id)
        {
            return GetHostList().First(s => s.id == id);
        }

        public void EnableHostById(int id)
        {
            _connection.WriteLine("/oper/slb/ena " + id);
            _connection.ReadUntil(">>");
        }

        public void DisableHostById(int id)
        {
            _connection.WriteLine("/oper/slb/dis " + id);
            string s;
            while (!(s = _connection.ReadToEnd()).Contains(">>"))
            {
                if (s.Contains("Allow cookie persistent HTTP sessions ?"))
                {
                    _connection.WriteLine(_settings.AllowCookiePersistedSessions ? "y" : "n");
                }
                else if (s.Contains("Mark existing sessions for removal from session table?"))
                {
                    _connection.WriteLine(_settings.RemoveExistingConnectionsFromSessionTable ? "y" : "n");
                }
                else if (s.Contains("?")) throw new LoadBalancerCommunicationException(string.Format("Error while trying to disconnect server {0}, unrecognized response \"{1}\".", id, s));
            }
        }

        public void Dispose()
        {
            if (_connection == null)
                return;

            try
            {
                _connection.WriteLine("exit");
            } catch {}
            _connection.Dispose();
        }

        private class Connection : IDisposable
        {
            private readonly TcpClient _socket;
            private readonly StreamReader _reader;
            private readonly StreamWriter _writer;
            private readonly char[] _buffer;

            public Connection(ILoadBalancerSettings settings)
            {
                _socket = new TcpClient(settings.Host, 23);
                _socket.ReceiveTimeout = 2000;

                _buffer = new char[_socket.ReceiveBufferSize];
                var stream = _socket.GetStream();
                _reader = new StreamReader(stream);
                _writer = new StreamWriter(stream)
                {
                    AutoFlush = true,
                    NewLine = "\n"
                };
            }

            private void EnsureConnected()
            {
                if (!_socket.Connected)
                    throw new LoadBalancerCommunicationException("Error while reading from load balancer, expected to read some data from the socket, but the socket was in a faulted state.");
            }

            public string ReadToEnd()
            {
                EnsureConnected();
                var sb = new StringBuilder();
                ReadToEnd(sb);
                return sb.ToString();
            }

            private int ReadToEnd(StringBuilder dest)
            {
                var totalBytesRead = 0;
                int len;
                do
                {
                    len = _reader.Read(_buffer, 0, _buffer.Length);
                    dest.Append(_buffer, 0, len);
                    totalBytesRead += len;
                } while (len == _buffer.Length);
                return totalBytesRead;
            }

            public string ReadUntil(string expected)
            {
                EnsureConnected();

                var continueMsg = "Press q to quit, any other key to continue";

                var sb = new StringBuilder();
                do
                {
                    if (sb.ToString().Contains(continueMsg))
                    {
                        WriteLine(" ");

                        sb.Remove(sb.Length - continueMsg.Length, continueMsg.Length);
                    }

                    ReadToEnd(sb);
                }
                while (!sb.ToString().Contains(expected));

                return sb.ToString();
            }

            public void WriteLine(string str)
            {
                EnsureConnected();
                _writer.WriteLine(str);
            }

            public void Dispose()
            {
                try
                {
                    if (_socket.Connected) _socket.Close();
                } catch { }
            }
        }
    }
}