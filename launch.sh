#!/bin/dash

for repo in */; do
    # Vérifier si c'est bien un dossier et s'il contient un package.json
    if [ -d "$repo" ] && [ -f "$repo/package.json" ]; then
        echo "Traitement du dépôt: $repo"
        
        # Aller dans le dossier
        cd "$repo" || continue
        
        # Installer les dépendances et démarrer l'application
        npm install && npm start > /dev/null
        
        # Revenir à la racine du projet
        cd ..
    fi
done