$pacDir = "$PSScriptRoot"
$port = 9999
$pacUrl = "http://127.0.0.1:$port/proxy.pac"
$regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PAC Proxy Switcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-ItemProperty -Path $regPath -Name ProxyEnable -Value 0
Set-ItemProperty -Path $regPath -Name AutoConfigURL -Value $pacUrl

Write-Host "  PAC URL: $pacUrl" -ForegroundColor Green
Write-Host "  CN  -> 192.168.103.145:8080" -ForegroundColor Green
Write-Host "  INT -> 192.168.103.145:8888" -ForegroundColor Green
Write-Host "  LAN -> DIRECT" -ForegroundColor Green
Write-Host ""
Write-Host "  Keep this window open!" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop" -ForegroundColor DarkGray
Write-Host ""

try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response
        $localPath = $context.Request.Url.AbsolutePath
        if ($localPath -eq "/") { $localPath = "/proxy.pac" }

        $filePath = Join-Path $pacDir $localPath.TrimStart("/")

        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            $response.ContentType = "application/x-ns-proxy-autoconfig"
            $output = $response.OutputStream
            $output.Write($content, 0, $content.Length)
            $output.Close()
        } else {
            $response.StatusCode = 404
            $response.Close()
        }
    }
} finally {
    Write-Host ""
    Write-Host "Restoring proxy settings..." -ForegroundColor Yellow
    Set-ItemProperty -Path $regPath -Name AutoConfigURL -Value ""
    Set-ItemProperty -Path $regPath -Name ProxyEnable -Value 0
    Write-Host "Done." -ForegroundColor Green
    if ($listener.IsListening) { $listener.Stop() }
}
