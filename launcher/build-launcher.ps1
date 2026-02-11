$ErrorActionPreference = "Stop"

$launcherDir = (Resolve-Path (Split-Path -Parent $MyInvocation.MyCommand.Path)).Path
$projectRoot = (Resolve-Path (Join-Path $launcherDir "..")).Path
$distDir = Join-Path $launcherDir "dist"
$batPath = Join-Path $launcherDir "RunPortfolio.bat"
$targetExe = Join-Path $distDir "RunPortfolio.exe"

if (-not (Test-Path $batPath)) {
  throw "Missing launcher batch file: $batPath"
}

if (-not (Test-Path $distDir)) {
  New-Item -ItemType Directory -Path $distDir | Out-Null
}

$escapedAppCommand = "cmd /c RunPortfolio.bat `"$projectRoot`""

$sedContent = @"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=1
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=
DisplayLicense=
FinishMessage=
TargetName=$targetExe
FriendlyName=Run Portfolio
AppLaunched=$escapedAppCommand
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
SourceFiles=SourceFiles
[SourceFiles]
SourceFiles0=$launcherDir
[SourceFiles0]
%FILE0%=
[Strings]
FILE0=RunPortfolio.bat
"@

$tempSed = Join-Path $env:TEMP ("run-portfolio-" + [Guid]::NewGuid().ToString() + ".sed")
Set-Content -Path $tempSed -Value $sedContent -Encoding ASCII

try {
  & iexpress.exe /N /Q $tempSed | Out-Null
  Write-Host "Built: $targetExe"
}
finally {
  if (Test-Path $tempSed) {
    Remove-Item $tempSed -Force -ErrorAction SilentlyContinue
  }
}
