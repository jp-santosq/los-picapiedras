#!/bin/bash

# Obtener el ID del contenedor por nombre
ID=$(docker inspect --format='{{.Id}}' agileOrganizerContainer 2>/dev/null)

if [ -z "$ID" ]; then
  echo "El contenedor 'agileOrganizerContainer' no existe."
  exit 1
fi

# Detener el contenedor
docker stop "$ID"

# Eliminar el contenedor
docker rm "$ID"

echo "Contenedor $ID detenido y eliminado."

