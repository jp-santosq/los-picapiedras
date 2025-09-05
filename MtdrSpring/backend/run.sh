#!/bin/bash
mv wallet minikube
cd minikube
./nm.sh
./wallet2k8s.sh
mv wallet ..
cd ..

## Creacion de la imagen de docker :$
docker build -f DockerfileDev --platform linux/arm64 -t mx-queretaro-1.ocir.io/axymxlp5v5nh/reacttodo/x7djf/todolistapp-springboot:0.1 .
docker ps 
docker run -it --name agileOrganizerContainer -p 8080:8080 mx-queretaro-1.ocir.io/axymxlp5v5nh/reacttodo/x7djf/todolistapp-springboot:0.1
