# Script de nettoyage des processus Node
Write-Host "Nettoyage des processus en cours..." -ForegroundColor Yellow

# Arret de tous les processus Node
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Arret des processus Node..." -ForegroundColor Cyan
    $nodeProcesses | Stop-Process -Force
    Write-Host "[OK] Processus Node arretes" -ForegroundColor Green
} else {
    Write-Host "Aucun processus Node en cours" -ForegroundColor Gray
}

# Arret de tous les processus npm
$npmProcesses = Get-Process npm -ErrorAction SilentlyContinue
if ($npmProcesses) {
    Write-Host "Arret des processus npm..." -ForegroundColor Cyan
    $npmProcesses | Stop-Process -Force
    Write-Host "[OK] Processus npm arretes" -ForegroundColor Green
} else {
    Write-Host "Aucun processus npm en cours" -ForegroundColor Gray
}

# Attente pour s'assurer que les ports sont liberes
Write-Host "Attente de la liberation des ports..." -ForegroundColor Blue
Start-Sleep -Seconds 3

# Verification des ports specifiques
$ports = @(3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 2066)
Write-Host "`nVerification des ports..." -ForegroundColor Yellow

foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "[!] Port $port est toujours utilise. Tentative de fermeture..." -ForegroundColor Red
        $connection | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    } else {
        Write-Host "[OK] Port $port est libre" -ForegroundColor Green
    }
}

Write-Host "`nNettoyage termine !" -ForegroundColor Green
Write-Host "Vous pouvez maintenant lancer votre script de demarrage." -ForegroundColor Cyan