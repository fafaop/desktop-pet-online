$exe = (Resolve-Path (Join-Path $PSScriptRoot '..\dist\win-unpacked\Desktop Pet Online.exe')).Path
function ProjectProcesses {
  @(Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -eq $exe })
}

try {
  Start-Process -FilePath $exe | Out-Null
  $deadline = (Get-Date).AddSeconds(20)
  do {
    Start-Sleep -Milliseconds 500
    $processes = ProjectProcesses
    $browserProcesses = @($processes | Where-Object { $_.CommandLine -notmatch '--type=' })
    $rendererProcesses = @($processes | Where-Object { $_.CommandLine -match '--type=renderer' })
    $visibleWindows = @(Get-Process | Where-Object { $_.Path -eq $exe -and $_.MainWindowHandle -ne 0 })
  } while (($browserProcesses.Count -ne 1 -or $rendererProcesses.Count -lt 2 -or $visibleWindows.Count -lt 1) -and (Get-Date) -lt $deadline)

  if ($browserProcesses.Count -ne 1) { throw "Expected one browser process, found $($browserProcesses.Count)" }
  if ($rendererProcesses.Count -lt 2) { throw "Expected two renderer processes, found $($rendererProcesses.Count)" }
  if ($visibleWindows.Count -lt 1) { throw 'No packaged application window became visible' }

  Start-Process -FilePath $exe | Out-Null
  Start-Sleep -Seconds 4
  $processes = ProjectProcesses
  $browserProcesses = @($processes | Where-Object { $_.CommandLine -notmatch '--type=' })
  $rendererProcesses = @($processes | Where-Object { $_.CommandLine -match '--type=renderer' })
  if ($browserProcesses.Count -ne 1 -or $rendererProcesses.Count -lt 2) {
    throw "Single-instance check failed: browsers=$($browserProcesses.Count), renderers=$($rendererProcesses.Count)"
  }

  Write-Output 'Packaged application smoke test passed'
  exit 0
} finally {
  foreach ($process in (ProjectProcesses)) {
    Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
  }
}
