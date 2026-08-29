# Copy Cornerstone original photos into frontend public images folder
# Usage: Run from PowerShell with appropriate permissions.

$source = "D:\church of Christ\Cornerstone_Family_Chapel_Web_Photos_Original"
$dest = "d:\church of Christ\frontend\public\images\cornerstone"

if (-not (Test-Path $source)) {
    Write-Error "Source folder not found: $source"
    exit 1
}

if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
}

Get-ChildItem -Path $source -Recurse -File | Where-Object { $_.Extension -match "\\.(jpg|jpeg|png|gif)$" } | ForEach-Object {
    $relative = $_.FullName.Substring($source.Length).TrimStart('\\')
    $filename = $_.Name
    $target = Join-Path $dest $filename
    if (Test-Path $target) {
        Write-Host "Skipping existing file: $filename"
    } else {
        Copy-Item -Path $_.FullName -Destination $target
        Write-Host "Copied: $filename"
    }
}

Write-Host "Import complete. Please verify the files in $dest"