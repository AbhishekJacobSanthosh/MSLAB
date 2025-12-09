# Kubernetes Setup Guide

This guide will help you set up Kubernetes to deploy and test the UniGIG project with Eureka service discovery.

**Choose your platform:**
- **[Windows (Docker Desktop)](#windows-docker-desktop)** - Easiest for Windows users
- **[WSL2/Linux (Minikube)](#wsl2linux-minikube)** - For WSL2 or native Linux
- **[macOS (Docker Desktop or Minikube)](#macos-docker-desktop-or-minikube)** - For Mac users

---

## 🪟 Windows (Docker Desktop)

### Prerequisites

- Windows 10/11 with WSL2 enabled
- At least 8GB RAM

### Step 1: Install Docker Desktop

1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Run the installer
3. Ensure "Use WSL 2 instead of Hyper-V" is selected
4. Restart your computer if prompted

### Step 2: Enable Kubernetes in Docker Desktop

1. **Open Docker Desktop**
2. Click **Settings** (gear icon)
3. Go to **Kubernetes** tab
4. Check **Enable Kubernetes**
5. Click **Apply & Restart**
6. Wait for Kubernetes to start (green indicator)

### Step 3: Verify Installation

**PowerShell or CMD:**
```powershell
# Check Docker
docker --version

# Check kubectl
kubectl version --client

# Check cluster
kubectl cluster-info
kubectl get nodes
```

You should see one node named `docker-desktop`.

### Step 4: Build Docker Images

**PowerShell (navigate to project directory):**
```powershell
cd path\to\MSLab-project\MSLAB

# Build all images
docker build -t eureka-server:latest .\eureka-server
docker build -t user-service:latest .\user-service
docker build -t gig-service:latest .\gig-service
docker build -t payment-service:latest .\payment-service
docker build -t application-service:latest .\application-service
docker build -t frontend:latest .\frontend

# Verify images
docker images | Select-String "eureka|user-service|gig-service|payment-service|application-service|frontend"
```

### Step 5: Deploy to Kubernetes

```powershell
# Apply all manifests
kubectl apply -f k8s/

# Watch pods starting
kubectl get pods -w
```

Press `Ctrl+C` when all pods show `Running`.

### Step 6: Access Services

**Open new PowerShell windows for each:**

```powershell
# Terminal 1 - Eureka Dashboard
kubectl port-forward svc/eureka-server 8761:8761
# Open: http://localhost:8761

# Terminal 2 - Frontend
kubectl port-forward svc/frontend 3000:80
# Open: http://localhost:3000
```

### Cleanup

```powershell
# Delete resources
kubectl delete -f k8s/

# Stop Kubernetes (optional)
# Docker Desktop > Settings > Kubernetes > Uncheck "Enable Kubernetes"
```

---

## 🐧 WSL2/Linux (Minikube)

### Prerequisites

- WSL2 installed on Windows (for WSL2 users)
- Ubuntu or another Linux distribution
- At least 4GB RAM allocated

---

## 🐳 Step 1: Install Docker on WSL2

### Option A: Install Docker Engine (Recommended for WSL2)

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker service
sudo service docker start

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Apply group changes (or logout and login again)
newgrp docker

# Verify Docker installation
docker --version
docker ps
```

### Option B: Use Docker Desktop for Windows (Alternative)

If you prefer Docker Desktop:
1. Install Docker Desktop for Windows
2. Enable WSL2 integration in Docker Desktop settings
3. Enable integration with your WSL2 distro

---

## ☸️ Step 2: Install kubectl (Kubernetes CLI)

```bash
# Download the latest kubectl binary
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Make it executable
chmod +x kubectl

# Move to PATH
sudo mv kubectl /usr/local/bin/

# Verify installation
kubectl version --client
```

---

## 🚀 Step 3: Install Minikube

Minikube is a lightweight Kubernetes implementation that creates a local cluster.

```bash
# Download Minikube binary
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Install Minikube
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Remove the downloaded file
rm minikube-linux-amd64

# Verify installation
minikube version
```

---

## 🎯 Step 4: Start Minikube

```bash
# Start Minikube with Docker driver
minikube start --driver=docker

# This will:
# - Download Kubernetes components
# - Create a Kubernetes cluster in Docker
# - Configure kubectl to use this cluster

# Verify cluster is running
minikube status

# Check kubectl can connect
kubectl cluster-info
kubectl get nodes
```

**Expected output:**
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

---

## 🏗️ Step 5: Build Docker Images for Your Services

Navigate to your project directory and build all the Docker images:

```bash
# Navigate to project root
cd /home/aagnik/MSLab-project/MSLAB

# Build all service images
docker build -t eureka-server:latest ./eureka-server
docker build -t user-service:latest ./user-service
docker build -t gig-service:latest ./gig-service
docker build -t payment-service:latest ./payment-service
docker build -t application-service:latest ./application-service
docker build -t frontend:latest ./frontend

# Verify images are built
docker images | grep -E "eureka|user-service|gig-service|payment-service|application-service|frontend"
```

---

## 📦 Step 6: Load Images into Minikube

Since Minikube runs in its own Docker environment, you need to load your local images:

```bash
# Load each image into Minikube
minikube image load eureka-server:latest
minikube image load user-service:latest
minikube image load gig-service:latest
minikube image load payment-service:latest
minikube image load application-service:latest
minikube image load frontend:latest

# Verify images are loaded in Minikube
minikube image ls | grep -E "eureka|user-service|gig-service|payment-service|application-service|frontend"
```

---

## 🚢 Step 7: Deploy to Kubernetes

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# This will create:
# - Deployments for all services
# - Services for networking
```

---

## 🔍 Step 8: Monitor Deployment

```bash
# Watch pods starting up
kubectl get pods -w

# Wait until all pods show STATUS: Running
# Press Ctrl+C to stop watching

# Check all pods status
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments

# If a pod is not running, check logs:
kubectl logs <pod-name>

# Example:
kubectl logs eureka-server-<pod-id>
```

**Expected output (all pods should be Running):**
```
NAME                                   READY   STATUS    RESTARTS   AGE
application-service-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
eureka-server-xxxxxxxxxx-xxxxx         1/1     Running   0          2m
frontend-xxxxxxxxxx-xxxxx              1/1     Running   0          2m
gig-service-xxxxxxxxxx-xxxxx           1/1     Running   0          2m
payment-service-xxxxxxxxxx-xxxxx       1/1     Running   0          2m
user-service-xxxxxxxxxx-xxxxx          1/1     Running   0          2m
```

---

## 🌐 Step 9: Access Services via Port Forwarding

### Access Eureka Dashboard (Service Discovery)

```bash
# Port forward Eureka server
kubectl port-forward svc/eureka-server 8761:8761
```

**Open in browser:** http://localhost:8761

You should see the Eureka dashboard with all registered services:
- USER-SERVICE
- GIG-SERVICE
- PAYMENT-SERVICE
- APPLICATION-SERVICE

**Keep this terminal open.** Open a new terminal for the next commands.

### Access Frontend

```bash
# In a NEW terminal, port forward frontend
kubectl port-forward svc/frontend 3000:80
```

**Open in browser:** http://localhost:3000

You can now use the application!

### Access Individual Services (Optional)

```bash
# User Service
kubectl port-forward svc/user-service 8081:8081

# Gig Service
kubectl port-forward svc/gig-service 8082:8082

# Payment Service
kubectl port-forward svc/payment-service 8083:8083

# Application Service
kubectl port-forward svc/application-service 8084:8084
```

---

## 🧪 Step 10: Test Eureka Service Discovery

### Verify Services are Registered

1. **Open Eureka Dashboard:** http://localhost:8761
2. **Check "Instances currently registered with Eureka" section**
3. You should see all 4 services listed

### Test Service Communication

```bash
# Get into a service pod to test inter-service communication
kubectl exec -it deployment/user-service -- /bin/sh

# Inside the pod, test DNS resolution
nslookup eureka-server
nslookup gig-service

# Exit the pod
exit
```

### Check Service Logs

```bash
# Check if services successfully registered with Eureka
kubectl logs deployment/user-service | grep -i eureka
kubectl logs deployment/gig-service | grep -i eureka
kubectl logs deployment/payment-service | grep -i eureka
kubectl logs deployment/application-service | grep -i eureka

# Check Eureka server logs
kubectl logs deployment/eureka-server
```

You should see messages like:
- "Registered instance USER-SERVICE/..."
- "Lease registered for USER-SERVICE"

---

## 🔧 Useful Kubernetes Commands

### Debugging

```bash
# Describe a pod (shows events and errors)
kubectl describe pod <pod-name>

# Get logs from a pod
kubectl logs <pod-name>

# Follow logs in real-time
kubectl logs -f <pod-name>

# Execute command in a pod
kubectl exec -it <pod-name> -- /bin/sh

# Get all resources
kubectl get all
```

### Restart Services

```bash
# Restart a deployment (recreates pods)
kubectl rollout restart deployment/user-service

# Delete and recreate a pod
kubectl delete pod <pod-name>
# Kubernetes will automatically create a new one
```

### Scaling

```bash
# Scale a service to multiple replicas
kubectl scale deployment/user-service --replicas=3

# Check replicas
kubectl get pods | grep user-service
```

### Cleanup

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete individual resources
kubectl delete deployment user-service
kubectl delete service user-service
```

---

## 🛑 Step 11: Stop and Clean Up

### Stop Port Forwarding
Press `Ctrl+C` in terminals running port-forward commands

### Delete Kubernetes Resources

```bash
# Delete all deployed resources
kubectl delete -f k8s/

# Verify deletion
kubectl get all
```

### Stop Minikube

```bash
# Stop the cluster (preserves state)
minikube stop

# Delete the cluster (removes everything)
minikube delete

# Check status
minikube status
```

### Stop Docker (if needed)

```bash
# Stop Docker service
sudo service docker stop
```

---

## 🎯 Quick Start Script

Save this as `start-k8s.sh` for easy startup:

```bash
#!/bin/bash

echo "🚀 Starting Minikube..."
minikube start --driver=docker

echo "🏗️ Building Docker images..."
cd /home/aagnik/MSLab-project/MSLAB
docker build -t eureka-server:latest ./eureka-server
docker build -t user-service:latest ./user-service
docker build -t gig-service:latest ./gig-service
docker build -t payment-service:latest ./payment-service
docker build -t application-service:latest ./application-service
docker build -t frontend:latest ./frontend

echo "📦 Loading images into Minikube..."
minikube image load eureka-server:latest
minikube image load user-service:latest
minikube image load gig-service:latest
minikube image load payment-service:latest
minikube image load application-service:latest
minikube image load frontend:latest

echo "🚢 Deploying to Kubernetes..."
kubectl apply -f k8s/

echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod --all --timeout=300s

echo "✅ Deployment complete!"
echo ""
echo "📊 Access Eureka Dashboard:"
echo "   kubectl port-forward svc/eureka-server 8761:8761"
echo "   Then open: http://localhost:8761"
echo ""
echo "🌐 Access Frontend:"
echo "   kubectl port-forward svc/frontend 3000:80"
echo "   Then open: http://localhost:3000"
```

Make it executable:
```bash
chmod +x start-k8s.sh
./start-k8s.sh
```

---

## 🐛 Troubleshooting

### Issue: Minikube won't start

```bash
# Check Docker is running
docker ps

# If not, start Docker
sudo service docker start

# Delete and recreate Minikube
minikube delete
minikube start --driver=docker
```

### Issue: Pods stuck in "ImagePullBackOff"

```bash
# Check if images are loaded
minikube image ls | grep user-service

# If not, load them again
minikube image load user-service:latest
```

### Issue: Pods stuck in "CrashLoopBackOff"

```bash
# Check logs
kubectl logs <pod-name>

# Common causes:
# - Database connection issues (no Postgres in K8s setup)
# - Eureka connection issues
# - Port conflicts
```

### Issue: Can't access services via port-forward

```bash
# Make sure pod is running
kubectl get pods

# Check service exists
kubectl get svc

# Try different port
kubectl port-forward svc/eureka-server 8762:8761
```

---

## 🍎 macOS (Docker Desktop or Minikube)

### Option 1: Docker Desktop (Recommended)

#### Step 1: Install Docker Desktop

1. Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. Install and start Docker Desktop
3. Go to **Settings** → **Kubernetes**
4. Check **Enable Kubernetes**
5. Click **Apply & Restart**

#### Step 2: Verify Installation

```bash
# Check installations
docker --version
kubectl version --client
kubectl cluster-info
kubectl get nodes
```

#### Step 3: Build and Deploy

```bash
# Navigate to project
cd ~/path/to/MSLab-project/MSLAB

# Build images
docker build -t eureka-server:latest ./eureka-server
docker build -t user-service:latest ./user-service
docker build -t gig-service:latest ./gig-service
docker build -t payment-service:latest ./payment-service
docker build -t application-service:latest ./application-service
docker build -t frontend:latest ./frontend

# Deploy
kubectl apply -f k8s/

# Monitor
kubectl get pods -w
```

#### Step 4: Access Services

```bash
# Terminal 1 - Eureka
kubectl port-forward svc/eureka-server 8761:8761

# Terminal 2 - Frontend
kubectl port-forward svc/frontend 3000:80
```

### Option 2: Minikube

Follow the same steps as WSL2/Linux section above, but use Homebrew for installation:

```bash
# Install Minikube
brew install minikube

# Install kubectl (if not already installed)
brew install kubectl

# Start Minikube
minikube start --driver=docker

# Continue with steps from WSL2/Linux section
```

---

## 📝 Notes


1. **No Database in K8s Setup:** The current K8s manifests don't include PostgreSQL. Services will fail to connect to DB. You may need to add a Postgres deployment or use Docker Compose for the database.

2. **Image Updates:** After code changes, rebuild images and reload into Minikube:
   ```bash
   docker build -t user-service:latest ./user-service
   minikube image load user-service:latest
   kubectl rollout restart deployment/user-service
   ```

3. **Resource Usage:** Minikube can be resource-intensive. Monitor with:
   ```bash
   minikube status
   kubectl top nodes
   kubectl top pods
   ```

4. **WSL2 Memory:** If WSL2 runs out of memory, create `.wslconfig` in Windows user directory:
   ```
   [wsl2]
   memory=4GB
   processors=2
   ```

---

## 🎓 Summary

You now have a complete Kubernetes setup on WSL2! You can:

✅ Deploy microservices to Kubernetes  
✅ Test Eureka service discovery  
✅ Access services via port-forwarding  
✅ Monitor and debug deployments  
✅ Scale services up and down  

**Next Steps:**
- Add PostgreSQL to K8s for full functionality
- Explore Kubernetes Ingress for better routing
- Learn about ConfigMaps and Secrets for configuration
- Try deploying to a cloud K8s cluster (EKS, GKE, AKS)
