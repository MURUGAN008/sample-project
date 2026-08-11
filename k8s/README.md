# ☸️ Kubernetes (K8s) Deployment Guide - Cake Delight

This directory contains production-grade Kubernetes manifest files to deploy the full **Cake Delight Microservices Application** on Minikube.

---

## 📁 Manifest Files Breakdown

| Manifest File | Contents |
| :--- | :--- |
| **`00-configmap.yaml`** | Centralized ConfigMap storing internal service discovery URIs and RabbitMQ connection URLs. |
| **`01-databases.yaml`** | Deployments & ClusterIP Services for isolated MongoDB databases (`catalog-db`, `order-db`, `rating-db`, `notification-db`) and RabbitMQ message broker. |
| **`02-backend-services.yaml`** | Deployments & Services for `catalog-service`, `order-service`, `rating-service`, and `notification-service`. |
| **`03-gateway-frontend.yaml`** | Deployments & NodePort Services for `api-gateway` (NodePort 30500) and `frontend` (NodePort 30000). |

---

## 🚀 Deployment Instructions (Azure VM / Any Linux VM)

### Prerequisites
- Docker installed
- Minikube installed (`curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && sudo install minikube-linux-amd64 /usr/local/bin/minikube`)
- kubectl installed

### 1. Start Minikube

```bash
# Auto-detects driver (Docker, Hyper-V, etc.)
minikube start

# Check status of existing minikube
minikube status

# Stop a running minikube
minikube stop
```

### 2. Build All Docker Images

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

### 4. Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

### 5. Verify Deployment

```bash
# Check all pods are Running
kubectl get pods

# Check services & NodePorts
kubectl get svc
```

### 6. Access the Application

```bash
# Get Minikube IP
minikube ip

# Access Frontend:  http://<minikube-ip>:30000
# Access API Gateway: http://<minikube-ip>:30500
```

Or use minikube tunnel for direct access:
```bash
minikube service frontend-service
minikube service api-gateway-service
```

### 7. Azure VM — Open Firewall Ports

If running on Azure VM, open these ports in the **Network Security Group (NSG)**:

| Port | Service | Direction |
|:-----|:--------|:----------|
| 30000 | Frontend UI | Inbound |
| 30500 | API Gateway | Inbound |

Then access from your browser: `http://<azure-vm-public-ip>:30000`

> **Note:** You may also need to set up port forwarding from VM → Minikube:
> ```bash
> # Run on Azure VM (in background)
> kubectl port-forward svc/frontend-service 30000:3000 --address 0.0.0.0 &
> kubectl port-forward svc/api-gateway-service 30500:5000 --address 0.0.0.0 &
> ```

### 8. Tear Down / Clean Up

```bash
kubectl delete -f k8s/
minikube stop
```
