Write-Host "Stopping Communalis dev stack" -ForegroundColor Cyan

docker compose -f docker-compose.dev.yml down

if ($LASTEXITCODE -eq 0) {
  Write-Host "Dev stack stopped." -ForegroundColor Green
} else {
  Write-Error "Failed to stop dev stack"
}
