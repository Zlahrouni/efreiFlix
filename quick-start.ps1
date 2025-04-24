# Nettoyage des processus avant le démarrage
Write-Host "Nettoyage des processus existants..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process npm -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "Attente de la libération des ports..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Liste des micro-frontends
$components = @(
    "breadcrumb",
    "catalogue",
    "db",
    "efreiflix-mfe-about",
    "efreiflix-mfe-admin",
    "efreiflix-mfe-searchbar",
    "fiche-produit",
    "header",
    "mfe-skeleton",
    "search-bar"
)

# Tableau pour stocker les processus
$jobs = @()

Write-Host "`nDémarrage de tous les micro-frontends..." -ForegroundColor Blue
Write-Host ""

# Démarrage de chaque composant
foreach ($component in $components) {
    Write-Host "Préparation de $component..." -ForegroundColor Green
    
    # Démarrer le composant en arrière-plan
    $job = Start-Job -ScriptBlock {
        param($componentPath, $projectRoot)
        Set-Location "$projectRoot\$componentPath"
        
        # Vérifier si node_modules existe
        if (-not (Test-Path "node_modules")) {
            Write-Host "Installation des dépendances pour $componentPath..." -ForegroundColor Cyan
            npm install
            Write-Host "Dépendances installées pour $componentPath" -ForegroundColor Green
        } else {
            Write-Host "Les dépendances sont déjà installées pour $componentPath" -ForegroundColor DarkGray
        }
        
        # Démarrer le composant
        Write-Host "Démarrage de $componentPath..." -ForegroundColor Green
        npm start
    } -ArgumentList $component, (Get-Location).Path
    
    $jobs += $job
    
    # Petite pause pour éviter les conflits de ports
    Start-Sleep -Seconds 2
}

# Démarrage du shell
Write-Host "`nPréparation du shell..." -ForegroundColor Blue
$shellJob = Start-Job -ScriptBlock {
    param($projectRoot)
    Set-Location "$projectRoot\shell"
    
    # Vérifier si node_modules existe
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installation des dépendances pour le shell..." -ForegroundColor Cyan
        npm install
        Write-Host "Dépendances installées pour le shell" -ForegroundColor Green
    } else {
        Write-Host "Les dépendances sont déjà installées pour le shell" -ForegroundColor DarkGray
    }
    
    # Démarrer le shell
    Write-Host "Démarrage du shell..." -ForegroundColor Green
    npm start
} -ArgumentList (Get-Location).Path

$jobs += $shellJob

Write-Host "`nTous les micro-frontends sont maintenant en cours de démarrage!" -ForegroundColor Green
Write-Host "Appuyez sur Ctrl+C pour arrêter tous les services." -ForegroundColor Yellow
Write-Host ""

# Fonction pour arrêter tous les processus
function Stop-AllJobs {
    Write-Host "`nArrêt de tous les micro-frontends..." -ForegroundColor Yellow
    foreach ($job in $jobs) {
        Stop-Job -Job $job
        Remove-Job -Job $job -Force
    }
    exit
}

# Gestion du Ctrl+C
try {
    while ($true) {
        # Afficher les sorties des jobs
        foreach ($job in $jobs) {
            Receive-Job -Job $job
        }
        
        Start-Sleep -Seconds 1
    }
}
finally {
    Stop-AllJobs
}