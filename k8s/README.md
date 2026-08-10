# ☸️ Kubernetes (K8s) Deployment Guide - Cake Delight

This directory contains production-grade Kubernetes manifest files to deploy the full **Cake Delight Microservices Application** on Minikube, Docker Desktop K8s, Kind, AWS EKS, or Google GKE.

---

## 📁 Manifest Files Breakdown

| Manifest File | Contents |
| :--- | :--- |
| **`00-configmap.yaml`** | Centralized ConfigMap storing internal service discovery URIs and RabbitMQ connection URLs. |
| **`01-databases.yaml`** | Deployments & ClusterIP Services for isolated MongoDB databases (`catalog-db`, `order-db`, `rating-db`, `notification-db`) and RabbitMQ message broker. |
| **`02-backend-services.yaml`** | High-availability Deployments (2 replicas each) & Services for `catalog-service`, `order-service`, `rating-service`, and `notification-service`. |
| **`03-gateway-frontend.yaml`** | Deployments & LoadBalancer/NodePort Services for `api-gateway` (Port 5000) and `frontend` (Port 3000). |

---

## 🚀 Deployment Instructions

### 1. Apply Manifests using `kubectl`

Run this single command to deploy all manifests in sequence:

```bash
kubectl apply -f k8s/
```

### 2. Verify Deployment Status

```bash
# Check running Pods
kubectl get pods

# Check active Services & external ports
kubectl get svc
```

### 3. Accessing the Application

* **Frontend UI**: `http://localhost:3000` (or `minikube service frontend-service`)
* **API Gateway**: `http://localhost:5000` (or `minikube service api-gateway-service`)

### 4. Tear Down / Clean Up

```bash
kubectl delete -f k8s/
```
