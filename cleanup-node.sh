#!/bin/bash

echo "Nettoyage des processus en cours..."

# Arret de tous les processus Node
node_pids=$(pgrep node)
if [ -n "$node_pids" ]; then
    echo "Arret des processus Node..."
    kill -9 $node_pids
    echo "[OK] Processus Node arretes"
else
    echo "Aucun processus Node en cours"
fi

# Arret de tous les processus npm
npm_pids=$(pgrep npm)
if [ -n "$npm_pids" ]; then
    echo "Arret des processus npm..."
    kill -9 $npm_pids
    echo "[OK] Processus npm arretes"
else
    echo "Aucun processus npm en cours"
fi

# Attente pour s'assurer que les ports sont liberes
echo "Attente de la liberation des ports..."
sleep 3

# Verification des ports specifiques
ports=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 2066)

echo ""
echo "Verification des ports..."

for port in "${ports[@]}"
do
    pid=$(lsof -ti tcp:$port)
    if [ -n "$pid" ]; then
        echo "[!] Port $port est toujours utilise. Tentative de fermeture..."
        kill -9 $pid
    else
        echo "[OK] Port $port est libre"
    fi
done

echo ""
echo "Nettoyage termine !"
echo "Vous pouvez maintenant lancer votre script de demarrage."
