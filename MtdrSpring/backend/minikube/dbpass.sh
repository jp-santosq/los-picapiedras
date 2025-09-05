#!/bin/bash

namespace="mtdrworkshop"
secret_name="dbuser"
password="None00010001"
base64Password=$(echo -n "$password" | base64)

json=$(cat <<EOF
{
  "apiVersion": "v1",
  "kind": "Secret",
  "metadata": {
    "name": "$secret_name"
  },
  "data": {
    "dbpassword": "$base64Password"
  }
}
EOF
)

# Intentar crear hasta que funcione
while ! kubectl get secret "$secret_name" -n "$namespace" >/dev/null 2>&1; do
  echo "Intentando crear el secreto de DB..."
  echo "$json" | kubectl create -n "$namespace" -f - && {
    echo "Secreto creado exitosamente."
    break
  }
  echo "Error al crear el secreto. Reintentando en 10 segundos..."
  sleep 10
done

