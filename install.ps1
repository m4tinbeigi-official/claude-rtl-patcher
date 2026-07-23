$ErrorActionPreference = 'Stop'
$repo = 'm4tinbeigi-official/claude-rtl-patcher'
$version = if ($env:CLAUDE_RTL_VERSION) { $env:CLAUDE_RTL_VERSION } else { 'latest' }
$archName = if ($env:PROCESSOR_ARCHITEW6432) { $env:PROCESSOR_ARCHITEW6432 } else { $env:PROCESSOR_ARCHITECTURE }
$arch = switch ($archName.ToUpperInvariant()) { 'AMD64' { 'x64'; break } default { throw "This Windows build supports x64 only (detected: $archName)" } }
$asset = "claude-rtl-patcher-windows-$arch.exe"
$base = "https://github.com/$repo/releases"
$url = if ($version -eq 'latest') { "$base/latest/download/$asset" } else { "$base/download/$version/$asset" }
$installDir = if ($env:CLAUDE_RTL_INSTALL_DIR) { $env:CLAUDE_RTL_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA 'ClaudeRtlPatcher' }
New-Item -ItemType Directory -Force -Path $installDir | Out-Null
$target = Join-Path $installDir 'claude-rtl-patcher.exe'
Write-Host "Downloading $asset..."
Invoke-WebRequest -Uri $url -OutFile $target
Write-Host "Installed to $target"
& $target @args
exit $LASTEXITCODE
