$projectRoot = "C:\EcoGestor"
if (-not (Test-Path (Join-Path $projectRoot "EcoGestor ERP.bat"))) {
    $projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
}
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "EcoGestor ERP.lnk"
$targetPath = Join-Path $projectRoot "EcoGestor ERP.bat"
$iconPath = Join-Path $projectRoot "assets\icons\ecogestor.ico"

$wshShell = New-Object -ComObject WScript.Shell
$shortcut = $wshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = $projectRoot

if (Test-Path $iconPath) {
    $shortcut.IconLocation = $iconPath
}

$shortcut.Save()

Write-Output "Atalho criado em: $shortcutPath"
