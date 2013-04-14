properties {
	$base_dir  = resolve-path .
	$lib_dir = "$base_dir\libs"
	$build_dir = "$base_dir\build_artifacts"
	$buildartifacts_dir = "$build_dir\"
	$sln_file = "$base_dir\AsimovDeploy.sln"
	$tools_dir = "$base_dir\tools"
	$configuration = "Debug"
	$drop_folder = "$base_dir\build_artifacts\drop"
	$version = "0.6"
	$commit = "1234567"
	$branch = "master"
	$build = "10"
}

task default -depends Release

task Clean {
	Remove-Item -force -recurse $build_dir -ErrorAction SilentlyContinue
}

task Init -depends Clean {
	$script:version = "$version.$build"
	$script:commit = $commit.substring(0,7)

	exec { git update-index --assume-unchanged "$base_dir\src\SharedAssemblyInfo.cs" }
	(Get-Content "$base_dir\src\SharedAssemblyInfo.cs") |
		Foreach-Object { $_ -replace "{version}", $script:version } |
		Set-Content "$base_dir\src\SharedAssemblyInfo.cs" -Encoding UTF8

	New-Item $build_dir -itemType directory -ErrorAction SilentlyContinue | Out-Null
}

function CreateZipFile([string] $name, [string] $folder) {
	$zipFile = "$base_dir\build_artifacts\packages\$name-v$script:version-[$branch]-[$script:commit].zip"
	$folderToZip = "$base_dir\build_artifacts\packages\$name\*"

	exec {
		& $tools_dir\7zip\7z.exe a -tzip `
			$zipFile `
			$folderToZip
	}
}

task CopyAsimovDeployWinAgent {
	$exclude = @('AsimovDeploy.WinAgentUpdater*', "packages", "*Tests*", "ConfigExamples", "drop")
	Copy-Item "$build_dir\*" "$build_dir\packages\AsimovDeploy.WinAgent" -Recurse -Force -Exclude $exclude

	CreateZipFile("AsimovDeploy.WinAgent")
}

task CopyAsimovDeployWinAgentUpdater {

	$include = @('AsimovDeploy.WinAgentUpdater*', "log4net*", "topshelf*", "Ionic.Zip*")
	Copy-Item "$build_dir\*" "$build_dir\packages\AsimovDeploy.WinAgentUpdater" -Recurse -Force -include $include

	CreateZipFile("AsimovDeploy.WinAgentUpdater")
}

task CopyAsimovDeployNodeFront {
	cd "src\AsimovDeploy.NodeFront"
	& npm install
	& .\node_modules\.bin\bbb release

	Copy-Item "$base_dir\src\AsimovDeploy.NodeFront" "$build_dir\packages" -Recurse -Force -include $include

	$nodeFrontConfig = "$build_dir\packages\AsimovDeploy.NodeFront\app\config.js"

	(Get-Content $nodeFrontConfig) |
		Foreach-Object { $_ -replace "{version}", $script:version } |
		Set-Content $nodeFrontConfig -Encoding UTF8

	CreateZipFile("AsimovDeploy.NodeFront")
}

task CreateDistributionPackage {
	New-Item $build_dir\packages\AsimovDeploy -Type directory -ErrorAction SilentlyContinue | Out-Null
	Copy-Item "$build_dir\packages\*.zip" "$build_dir\packages\AsimovDeploy" -Force -ErrorAction SilentlyContinue

	$licenseFiles = @('LICENSE', "NOTICE", "library-licenses")
	Copy-Item "$base_dir\*" "$build_dir\packages\AsimovDeploy" -Recurse -Force -include $licenseFiles

	CreateZipFile("AsimovDeploy")
}

task Compile -depends Init {

	$v4_net_version = (ls "$env:windir\Microsoft.NET\Framework\v4.0*").Name

	try {
		Write-Host "Compiling with '$configuration' configuration"
		exec { &"C:\Windows\Microsoft.NET\Framework\$v4_net_version\MSBuild.exe" "$sln_file" /p:OutDir="$buildartifacts_dir\" /p:Configuration=$configuration }
	} catch {
		Throw
	} finally {
		exec { git checkout "$base_dir\src\SharedAssemblyInfo.cs" }
	}
}

task Test -depends Compile {

}

task Release -depends DoRelease

task CreateOutputDirectories {
	New-Item $build_dir\packages -Type directory -ErrorAction SilentlyContinue | Out-Null
	New-Item $build_dir\packages\AsimovDeploy.WinAgent -Type directory | Out-Null
	New-Item $build_dir\packages\AsimovDeploy.WinAgentUpdater -Type directory | Out-Null
	New-Item $build_dir\drop -Type directory | Out-Null
}

task CopyToDropFolder {
	Write-Host "Copying to drop folder $drop_folder"

	New-Item "$drop_folder\$script:version" -Type directory | Out-Null

	Copy-Item "$build_dir\packages\*.zip" "$drop_folder\$script:version" -Force -ErrorAction SilentlyContinue
}

task DoRelease -depends Compile, `
	CreateOutputDirectories, `
	CopyAsimovDeployWinAgentUpdater, `
	CopyAsimovDeployWinAgent, `
	CopyAsimovDeployNodeFront, `
	CreateDistributionPackage, `
	CopyToDropFolder {
	Write-Host "Done building AsimovDeploy"
}
