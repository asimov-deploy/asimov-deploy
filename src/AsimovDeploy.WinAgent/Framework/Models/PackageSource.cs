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

using System.Collections.Generic;
using System.Linq;
using Ionic.Zip;

namespace AsimovDeploy.WinAgent.Framework.Models
{
    public abstract class PackageSource
    {
        public string Name { get; set; }

        public abstract IList<AsimovVersion> GetAvailableVersions(PackageInfo packageInfo);
        public abstract AsimovVersion GetVersion(string versionId, PackageInfo packageInfo);
        public abstract string CopyAndExtractToTempFolder(string versionId, PackageInfo packageInfo, string tempFolder);

        protected void Extract(string localFile, string tempFolder, string internalZipPath)
        {
            using (var zipFile = ZipFile.Read(localFile))
            {
                if (string.IsNullOrEmpty(internalZipPath))
                {
                    zipFile.ExtractAll(tempFolder);
                }
                else
                {
                    var selection = (from e in zipFile.Entries
                                     where (e.FileName).StartsWith(internalZipPath)
                                     select e);

                    foreach (var e in selection)
                    {
                        e.Extract(tempFolder);
                    }
                }
            }
        }
    }
}