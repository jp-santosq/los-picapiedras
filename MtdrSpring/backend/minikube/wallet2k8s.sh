#!/bin/bash

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
wallet_path="$script_dir/wallet"
namespace="mtdrworkshop"
secret_name="db-wallet-secret"

# Archivos a incluir
files=("README" "cwallet.sso" "ewallet.p12" "keystore.jks" "ojdbc.properties" "sqlnet.ora" "tnsnames.ora" "truststore.jks")

# Crear sqlnet.ora si no existe
sqlnet_path="$wallet_path/sqlnet.ora"
if [ ! -f "$sqlnet_path" ]; then
  cat <<EOF > "$sqlnet_path"
WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="/mtdrworkshop/creds")))
SSL_SERVER_DN_MATCH=yes
EOF
fi

echo "YAML build"

# Construir YAML
yaml=$(cat <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: $secret_name
  namespace: $namespace
type: Opaque
data:
EOF
)

for f in "${files[@]}"; do
  file_path="$wallet_path/$f"
  if [ -f "$file_path" ]; then
    encoded=$(base64 -i "$file_path" | tr -d '\n')
    yaml+="\n  $f: $encoded"
  else
    echo "Archivo no encontrado: $file_path"
  fi
done

echo -e "$yaml" | kubectl apply -f -

