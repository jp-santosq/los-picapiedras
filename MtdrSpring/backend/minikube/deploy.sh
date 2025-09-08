#!/bin/bash

yaml_file="win-todolistapp-springboot.yaml"
namespace="mtdrworkshop"

echo "Verificando estado de Minikube..."
if ! minikube status | grep -q "Running"; then
  echo "Minikube no está corriendo. Iniciando..."
  minikube start
else
  echo "Minikube ya está activo."
fi

if [ ! -f "$yaml_file" ]; then
  echo "Archivo YAML no encontrado: $yaml_file"
  exit 1
fi

echo "Aplicando configuración desde $yaml_file..."
kubectl apply -f "$yaml_file" --namespace "$namespace"

echo -e "\nRecursos desplegados:"
kubectl get all -n "$namespace" | grep "todolistapp"

echo -e "\nServicios disponibles:"
kubectl get svc -n "$namespace" | grep "todolistapp"

nodePort=$(kubectl get svc todolistapp-springboot-service -n "$namespace" -o=jsonpath="{.spec.ports[0].nodePort}")
minikubeIP=$(minikube ip)
serviceURL="http://$minikubeIP:$nodePort"

echo -e "\nAccede a tu app en: $serviceURL"
open "$serviceURL" 2>/dev/null || xdg-open "$serviceURL" 2>/dev/null || echo "Abre en navegador: $serviceURL"

