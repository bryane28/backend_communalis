param(
  [string]$SmtpUser,
  [string]$SmtpPass,
  [switch]$Build
)

Write-Host "Starting Communalis dev stack with SMTP (Mailtrap)" -ForegroundColor Cyan

if (-not $env:SMTP_USER -and $SmtpUser) { $env:SMTP_USER = $SmtpUser }
if (-not $env:SMTP_PASS -and $SmtpPass) { $env:SMTP_PASS = $SmtpPass }

if (-not $env:SMTP_USER) {
  $env:SMTP_USER = Read-Host "Enter SMTP_USER (Mailtrap)"
}
if (-not $env:SMTP_PASS) {
  $env:SMTP_PASS = Read-Host "Enter SMTP_PASS (Mailtrap)"
}

$composeArgs = @('-f', 'docker-compose.dev.yml', 'up', '-d')
if ($Build) { $composeArgs += '--build' }

docker compose @composeArgs

if ($LASTEXITCODE -eq 0) {
  Write-Host "Dev stack started. API: http://localhost:3000  Swagger: http://localhost:3000/api/docs" -ForegroundColor Green
} else {
  Write-Error "Failed to start dev stack"
}
