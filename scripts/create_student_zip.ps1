$ProjectRoot = Split-Path $PSScriptRoot -Parent
$ZipPath = Join-Path $env:USERPROFILE "Desktop\ECRS_Student_Handover.zip"
$Staging = Join-Path $env:TEMP "ecrs_student_staging"

if (Test-Path $Staging) { Remove-Item $Staging -Recurse -Force }
New-Item -ItemType Directory -Path $Staging | Out-Null

$ExcludeDirs = @('node_modules', 'vendor', '.git', 'dist', '.cursor')
$ExcludeFiles = @('.env')

Get-ChildItem $ProjectRoot -Force | ForEach-Object {
    if ($_.PSIsContainer) {
        if ($ExcludeDirs -contains $_.Name) { return }
        if ($_.Name -eq 'backend') {
            $destBackend = Join-Path $Staging 'backend'
            robocopy $_.FullName $destBackend /E /XD vendor node_modules storage\logs storage\framework\cache storage\framework\sessions storage\framework\views /XF .env /NFL /NDL /NJH /NJS | Out-Null
        } else {
            robocopy $_.FullName (Join-Path $Staging $_.Name) /E /NFL /NDL /NJH /NJS | Out-Null
        }
    } else {
        if ($ExcludeFiles -contains $_.Name) { return }
        Copy-Item $_.FullName (Join-Path $Staging $_.Name)
    }
}

if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
Compress-Archive -Path "$Staging\*" -DestinationPath $ZipPath -CompressionLevel Optimal
Remove-Item $Staging -Recurse -Force

$sizeMB = [math]::Round((Get-Item $ZipPath).Length / 1MB, 1)
Write-Host "Created: $ZipPath ($sizeMB MB)"
