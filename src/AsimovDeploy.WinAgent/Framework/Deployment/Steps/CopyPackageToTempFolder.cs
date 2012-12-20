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

using AsimovDeploy.WinAgent.Framework.Models;

namespace AsimovDeploy.WinAgent.Framework.Deployment.Steps
{
    public class CopyPackageToTempFolder : IDeployStep
    {
        private readonly IAsimovConfig _asimovConfig;

        public CopyPackageToTempFolder(IAsimovConfig asimovConfig)
        {
            _asimovConfig = asimovConfig;
        }

        public void Execute(DeployContext context)
        {
            var packageSource = _asimovConfig.GetPackageSourceFor(context.DeployUnit);

            context.TempFolderWithNewVersionFiles = packageSource.CopyAndExtractToTempFolder(context.NewVersion.Id, context.DeployUnit.PackageInfo, _asimovConfig.TempFolder);
        }
    }

}