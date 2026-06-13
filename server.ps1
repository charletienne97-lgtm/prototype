<<<<<<< HEAD
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not (Test-Path $root)) { $root = 'C:\prototype' }
$prefix = 'http://localhost:8000/'
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Listening on http://localhost:8000/ (serving $root)"
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $path = $req.Url.LocalPath.TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $file = Join-Path $root $path
    if (Test-Path $file) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $context.Response.ContentLength64 = $bytes.Length
      $ext = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
      switch ($ext) {
        '.html' { $context.Response.ContentType = 'text/html' }
        '.css'  { $context.Response.ContentType = 'text/css' }
        '.js'   { $context.Response.ContentType = 'application/javascript' }
        '.json' { $context.Response.ContentType = 'application/json' }
        '.png'  { $context.Response.ContentType = 'image/png' }
        '.jpg'  { $context.Response.ContentType = 'image/jpeg' }
        default { $context.Response.ContentType = 'application/octet-stream' }
      }
      $context.Response.OutputStream.Write($bytes,0,$bytes.Length)
    } else {
      $context.Response.StatusCode = 404
      $data = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      $context.Response.ContentLength64 = $data.Length
      $context.Response.OutputStream.Write($data,0,$data.Length)
    }
    $context.Response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
=======
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not (Test-Path $root)) { $root = 'C:\prototype' }
$prefix = 'http://localhost:8000/'
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Listening on http://localhost:8000/ (serving $root)"
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $path = $req.Url.LocalPath.TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $file = Join-Path $root $path
    if (Test-Path $file) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $context.Response.ContentLength64 = $bytes.Length
      $ext = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
      switch ($ext) {
        '.html' { $context.Response.ContentType = 'text/html' }
        '.css'  { $context.Response.ContentType = 'text/css' }
        '.js'   { $context.Response.ContentType = 'application/javascript' }
        '.json' { $context.Response.ContentType = 'application/json' }
        '.png'  { $context.Response.ContentType = 'image/png' }
        '.jpg'  { $context.Response.ContentType = 'image/jpeg' }
        default { $context.Response.ContentType = 'application/octet-stream' }
      }
      $context.Response.OutputStream.Write($bytes,0,$bytes.Length)
    } else {
      $context.Response.StatusCode = 404
      $data = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      $context.Response.ContentLength64 = $data.Length
      $context.Response.OutputStream.Write($data,0,$data.Length)
    }
    $context.Response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
>>>>>>> e0258237a532e58263f53ffb09e48602091e03d1
