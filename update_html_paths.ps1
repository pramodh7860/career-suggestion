# PowerShell script to update HTML file paths for static file serving
$htmlFiles = Get-ChildItem -Path "frontend\pages" -Filter "*.html"

foreach ($file in $htmlFiles) {
    Write-Host "Updating $($file.Name)..."
    
    # Read file content
    $content = Get-Content $file.FullName -Raw
    
    # Update CSS paths from ../styles/ to /styles/
    $content = $content -replace 'href="../styles/', 'href="/styles/'
    
    # Update JS paths from ../scripts/ to /scripts/
    $content = $content -replace 'src="../scripts/', 'src="/scripts/'
    
    # Update favicon path from ../assets/ to /assets/
    $content = $content -replace 'href="../assets/', 'href="/assets/'
    
    # Write updated content back to file
    Set-Content $file.FullName -Value $content -NoNewline
    
    Write-Host "Updated $($file.Name)"
}

Write-Host "All HTML files updated successfully!"

