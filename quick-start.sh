#!/bin/bash

# Définition des couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Nettoyage des processus avant le démarrage
echo -e "${YELLOW}Nettoyage des processus existants...${NC}"
pkill -f node 2>/dev/null || true
pkill -f npm 2>/dev/null || true
echo -e "${CYAN}Attente de la libération des ports...${NC}"
sleep 3

# Liste des micro-frontends
components=(
    "breadcrumb"
    "catalogue"
    "db"
    "efreiflix-mfe-about"
    "efreiflix-mfe-admin"
    "efreiflix-mfe-searchbar"
    "fiche-produit"
    "header"
    "mfe-skeleton"
    "search-bar"
)

# Tableau pour stocker les PIDs
declare -a pids

# Fonction pour arrêter tous les processus
function stop_all_processes {
    echo -e "\n${YELLOW}Arrêt de tous les micro-frontends...${NC}"
    for pid in "${pids[@]}"; do
        kill $pid 2>/dev/null || true
    done
    exit 0
}

# Capture du signal Ctrl+C
trap stop_all_processes SIGINT SIGTERM

echo -e "\n${BLUE}Démarrage de tous les micro-frontends...${NC}"
echo ""

# Démarrage de chaque composant
for component in "${components[@]}"; do
    echo -e "${GREEN}Préparation de $component...${NC}"
    
    # Créer un sous-shell pour chaque composant
    (
        cd "$component" || { echo -e "${RED}Le répertoire $component n'existe pas!${NC}"; exit 1; }
        
        # Vérifier si node_modules existe
        if [ ! -d "node_modules" ]; then
            echo -e "${CYAN}Installation des dépendances pour $component...${NC}"
            npm install
            echo -e "${GREEN}Dépendances installées pour $component${NC}"
        else
            echo -e "${GRAY}Les dépendances sont déjà installées pour $component${NC}"
        fi
        
        # Démarrer le composant
        echo -e "${GREEN}Démarrage de $component...${NC}"
        npm start
    ) > "${component}.log" 2>&1 &
    
    # Stocker le PID
    pids+=($!)
    
    # Petite pause pour éviter les conflits de ports
    sleep 2
done

# Démarrage du shell
echo -e "\n${BLUE}Préparation du shell...${NC}"
(
    cd "shell" || { echo -e "${RED}Le répertoire shell n'existe pas!${NC}"; exit 1; }
    
    # Vérifier si node_modules existe
    if [ ! -d "node_modules" ]; then
        echo -e "${CYAN}Installation des dépendances pour le shell...${NC}"
        npm install
        echo -e "${GREEN}Dépendances installées pour le shell${NC}"
    else
        echo -e "${GRAY}Les dépendances sont déjà installées pour le shell${NC}"
    fi
    
    # Démarrer le shell
    echo -e "${GREEN}Démarrage du shell...${NC}"
    npm start
) > "shell.log" 2>&1 &

# Stocker le PID du shell
pids+=($!)

echo -e "\n${GREEN}Tous les micro-frontends sont maintenant en cours de démarrage!${NC}"
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter tous les services.${NC}"
echo ""

# Surveiller les logs en temps réel
echo -e "${CYAN}Affichage des logs:${NC}"
tail -f *.log
