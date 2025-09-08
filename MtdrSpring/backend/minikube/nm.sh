#!/bin/bash

namespace="mtdrworkshop"

# Verificar si el namespace existe
if ! kubectl get namespace "$namespace" >/dev/null 2>&1; then
  echo "Namespace '$namespace' no existe. Creando..."
  cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: $namespace
EOF
else
  echo "Namespace '$namespace' ya existe."
fi

