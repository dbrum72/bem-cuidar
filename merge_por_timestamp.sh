#!/bin/bash

set -e

BRANCH="master"

echo "🔄 Atualizando remoto..."
git fetch origin

echo "🔀 Iniciando merge..."
git merge origin/$BRANCH || true

CONFLICT_FILES=$(git diff --name-only --diff-filter=U)

if [ -z "$CONFLICT_FILES" ]; then
    echo "✅ Nenhum conflito. Merge concluído."
    exit 0
fi

echo "⚠️ Arquivos em conflito:"
echo "$CONFLICT_FILES"
echo ""

for FILE in $CONFLICT_FILES; do
    echo "--------------------------------------"
    echo "📄 Verificando: $FILE"

    # Timestamp local (arquivo no sistema)
    LOCAL_TIME=$(stat -c %Y "$FILE")

    # Extrai arquivo remoto para área temporária
    TMP_REMOTE=$(mktemp)
    git show "origin/$BRANCH:$FILE" > "$TMP_REMOTE"

    REMOTE_TIME=$(stat -c %Y "$TMP_REMOTE")

    echo "⏱️  Local timestamp : $LOCAL_TIME"
    echo "⏱️  Remoto timestamp: $REMOTE_TIME"

    if [ "$LOCAL_TIME" -ge "$REMOTE_TIME" ]; then
        echo "➡️ Mantendo VERSÃO LOCAL (mais recente)"
        git checkout --ours "$FILE"
    else
        echo "⬅️ Mantendo VERSÃO REMOTA (mais recente)"
        git checkout --theirs "$FILE"
    fi

    rm "$TMP_REMOTE"

    # Marca como resolvido
    git add "$FILE"
done

echo ""
echo "🧩 Finalizando merge..."
git commit -m "Merge automático por timestamp"

echo "🎉 Merge completo com resolução automática por timestamp!"
