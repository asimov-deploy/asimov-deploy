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
using System.Net;
using System.Text.RegularExpressions;

namespace AsimovDeploy.WinAgent.Framework.Models.PackageSources {
    public class AsimovWebPackageSource : PackageSource {
        private readonly Regex anchorPattern = new Regex("<a.*?href\\s*=\\s*[\\\"']{1}(?<url>.*?)[\\\"']{1}.*?>.+?</a>", RegexOptions.Multiline | RegexOptions.IgnoreCase);
        private readonly WebClient webClient = new WebClient();

        public string Pattern { get; set; }
        public Uri Uri { get; set; }

        public AsimovWebPackageSource() {
            Pattern = @"v(?<version>\d+\.\d+\.\d+\.\d+)-\[(?<branch>\w*)\]-\[(?<commit>\w*)\]";
        }

        public override IList<AsimovVersion> GetAvailableVersions(PackageInfo packageInfo) {
            return FetchAvailableFiles().ToList();
        }

        public override AsimovVersion GetVersion(string versionId, PackageInfo packageInfo) {
            return GetAsimovVersionByName(versionId);
        }

         public override string CopyAndExtractToTempFolder(string versionId, PackageInfo packageInfo, string tempFolder) {
            var fileName = versionId + ".zip";
            var localZipFileName = Path.Combine(tempFolder, fileName);

            webClient.DownloadFile(Uri + "/" + versionId + ".zip", localZipFileName);

            Extract(localZipFileName, tempFolder, packageInfo.InternalPath);

            File.Delete(localZipFileName);

            return Path.Combine(tempFolder, packageInfo.InternalPath);
        }

        private IEnumerable<AsimovVersion> FetchAvailableFiles() {
            string html = webClient.DownloadString(Uri);
            
            var basePath = Uri.ToString();
            foreach(Uri uri in anchorPattern.Matches(html).Cast<Match>().Select(m => CreateUrl(m.Groups["url"].Value))) {
                var cleanedName = uri.ToString();
                if(!cleanedName.StartsWith(basePath)) {
                    continue;
                }

                cleanedName = cleanedName.Remove(0, basePath.Length);
                cleanedName = cleanedName.TrimStart('/');

                if(cleanedName.Contains("/"))
                    continue;

                cleanedName = cleanedName.Replace(".zip", "");

                var asimovVersion = GetAsimovVersionByName(cleanedName);
                if(asimovVersion != null)
                    yield return asimovVersion;
            }
        }

        public Uri CreateUrl(string absoluteOrRelativeUri) {
            var uri = new Uri(absoluteOrRelativeUri, IsAbsoluteUrl(absoluteOrRelativeUri) ? UriKind.Absolute : UriKind.Relative);
            return uri.IsAbsoluteUri ? uri : new Uri(Uri, uri);
        }

        public bool IsAbsoluteUrl(string url)
        {
            Uri result;
            return Uri.TryCreate(url, UriKind.Absolute, out result);                
        }

        private AsimovVersion GetAsimovVersionByName(string cleanedName) {
            Match match = Regex.Match(cleanedName, Pattern);
            if(!match.Success)
                return null;

            var version = new AsimovVersion();
            version.Id = cleanedName;

            version.Number = match.Groups["version"].Value;
            version.Branch = match.Groups["branch"].Value;
            version.Commit = match.Groups["commit"].Value;
            version.Timestamp = DateTime.UtcNow;

            return version;
        }
    }
}