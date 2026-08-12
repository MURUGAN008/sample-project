# 🎂 Cake Delight — Cloud-Native Microservices Engineering

[![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Containerization-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![RabbitMQ](https://img.shields.io/badge/Messaging-RabbitMQ-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

A production-grade, cloud-native microservices application built with **Node.js, Express, React, MongoDB, RabbitMQ, Docker, and Kubernetes**.

---

## 🧩 Microservices & Components Breakdown

| Service | Technology | Port | Database / Broker | Responsibility |
|:---|:---|:---:|:---|:---|
| **API Gateway** | Express, Proxy | `5000` | N/A | Single entry point, proxy routing, CORS handling |
| **Catalog Service** | Express, Mongoose | `3001` | `catalog-db` (MongoDB) | Product CRUD, category/search/price filters |
| **Order Service** | Express, Mongoose | `3002` | `order-db` (MongoDB) | Basket CRUD, total calculation, checkout, RabbitMQ publisher |
| **Rating Service** | Express, Mongoose | `3003` | `rating-db` (MongoDB) | Ratings submission, aggregate review calculations |
| **Notification Service** | Express, Mongoose, Nodemailer | `3004` | `notification-db` (MongoDB) | RabbitMQ event consumer, HTML email generator, audit logging |
| **RabbitMQ** | RabbitMQ 3 Management | `5672` / `15672` | AMQP Broker | Asynchronous `OrderCompleted` event delivery |
| **React Frontend** | React, Vite, Nginx | `3000` | LocalStorage | Responsive UI for browsing, cart, checkout, ratings, & notifications |

---

## 📋 Prerequisites

- **Docker** & **Docker Compose** (v2+)
- **Minikube** (for Kubernetes deployment)
- **kubectl** CLI tool

---

## 🚀 Option 1: Run Locally with Docker Compose

To spin up all microservices, databases, and RabbitMQ locally:

### 1. Build and Start Containers
```bash
docker-compose up --build
```

### 2. Access Application Services
- **Frontend UI:** `http://localhost:3000`
- **API Gateway:** `http://localhost:5000`
- **RabbitMQ Management Dashboard:** `http://localhost:15672` *(Username: `guest`, Password: `guest`)*

### 3. Stop Application
```bash
docker-compose down
```

---

## ☸️ Option 2: Deploy on Kubernetes (Minikube / Azure VM)

To deploy the application manifests on Minikube or an Azure VM:

### 1. Start Minikube Cluster
```bash
minikube start
```

### 2. Build Docker Images
```bash
docker-compose build
```

### 3. Load Images into Minikube
```bash
minikube image load cakedelight/catalog-service:latest
minikube image load cakedelight/order-service:latest
minikube image load cakedelight/rating-service:latest
minikube image load cakedelight/notification-service:latest
minikube image load cakedelight/api-gateway:latest
minikube image load cakedelight/frontend:latest
```

### 4. Apply Kubernetes Manifests
```bash
kubectl apply -f k8s/
```

### 5. Check Deployment Status
```bash
kubectl get pods
```

### 6. Access URLs
Get Minikube IP:
```bash
minikube ip
```

- **Frontend UI:** `http://<minikube-ip>:30000`
- **API Gateway:** `http://<minikube-ip>:30500`

> **Note for Azure VM Deployment:**  
> Ensure ports **30000** and **30500** are allowed in your Azure NSG inbound rules, or run port-forwarding:
> ```bash
> kubectl port-forward svc/frontend-service 30000:3000 --address 0.0.0.0 &
> kubectl port-forward svc/api-gateway-service 30500:5000 --address 0.0.0.0 &
> ```

---

## 📚 Documentation Links

- 📘 [API Reference & Event Schemas](API_DOCUMENTATION.md)
- ☸️ [Kubernetes Manifest Guide](k8s/README.md)
