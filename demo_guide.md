# UniGIG Demo Guide

This guide provides step-by-step instructions for demonstrating the UniGIG project. Choose your deployment method and follow the corresponding instructions.

---

## 🎯 Choose Your Demo Method

<details>
<summary><b>Method 1: Docker Compose (Recommended - Easiest)</b></summary>

### Prerequisites
- Docker and Docker Compose installed (see [README.md](README.md) for installation)

### Step 1: Start All Services

**All Platforms (Windows/WSL/Linux/macOS):**
```bash
# Navigate to project directory
cd MSLab-project/MSLAB

# Start everything
docker compose -f docker-compose-full.yml up --build -d

# Wait for services to start (2-3 minutes)
docker compose -f docker-compose-full.yml logs -f
```

Wait until you see logs indicating all services are running.

### Step 2: Access the Application

**Open in browser:**
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Eureka Dashboard**: [http://localhost:8761](http://localhost:8761)
- **PgAdmin**: [http://localhost:5050](http://localhost:5050)

### Step 3: Demonstrate Features

1. **Show Eureka Service Discovery**:
   - Open [http://localhost:8761](http://localhost:8761)
   - Point out all registered services: USER-SERVICE, GIG-SERVICE, PAYMENT-SERVICE, APPLICATION-SERVICE

2. **Show Frontend Application**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Register as a Professor (Admin)
   - Create a new gig
   - Logout and register as a Student
   - Apply for the gig
   - Switch back to Professor and approve the application
   - Show payment processing and wallet balance

3. **Show Database (Optional)**:
   - Open [http://localhost:5050](http://localhost:5050)
   - Login with `admin@unigig.com` / `password`
   - Connect to PostgreSQL server (already configured via servers.json)
   - Show tables and data

### Step 4: API Testing (Optional)

**Windows (PowerShell):**
```powershell
# Get all users
Invoke-WebRequest -Uri http://localhost:8081/users -Method GET

# Create a user
Invoke-WebRequest -Uri http://localhost:8081/users -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","role":"STUDENT"}'
```

**WSL/Linux/macOS:**
```bash
# Get all users
curl http://localhost:8081/users

# Create a user
curl -X POST http://localhost:8081/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","role":"STUDENT"}'
```

### Step 5: Cleanup

```bash
# Stop all services
docker compose -f docker-compose-full.yml down

# Remove volumes (optional - deletes database data)
docker compose -f docker-compose-full.yml down -v
```

</details>

---

<details>
<summary><b>Method 2: Kubernetes (Advanced)</b></summary>

### Prerequisites
- Kubernetes cluster running (Minikube, Docker Desktop K8s, or cloud cluster)
- kubectl installed
- Docker images built and loaded (see [KUBERNETES_SETUP.md](KUBERNETES_SETUP.md))

### Step 1: Deploy to Kubernetes

**All Platforms:**
```bash
# Navigate to project directory
cd MSLab-project/MSLAB

# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Wait for pods to be ready
kubectl get pods -w
```

Press `Ctrl+C` when all pods show `STATUS: Running`.

### Step 2: Show Service Discovery (Eureka)

**Terminal 1 - Port Forward Eureka:**
```bash
kubectl port-forward svc/eureka-server 8761:8761
```

**Open Browser**: [http://localhost:8761](http://localhost:8761)

**Show**: All microservices registered with Eureka:
- USER-SERVICE
- GIG-SERVICE
- PAYMENT-SERVICE
- APPLICATION-SERVICE

### Step 3: Demonstrate User Service

**Terminal 2 - Port Forward User Service:**
```bash
kubectl port-forward svc/user-service 8081:8081
```

**Windows (PowerShell):**
```powershell
# Create a student
Invoke-WebRequest -Uri http://localhost:8081/users -Method POST -ContentType "application/json" -Body '{"name":"Alice Student","email":"alice@college.edu","role":"STUDENT"}'

# Get all users
Invoke-WebRequest -Uri http://localhost:8081/users -Method GET
```

**WSL/Linux/macOS:**
```bash
# Create a student
curl -X POST http://localhost:8081/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Student","email":"alice@college.edu","role":"STUDENT"}'

# Get all users
curl http://localhost:8081/users
```

### Step 4: Demonstrate Gig Service

**Terminal 3 - Port Forward Gig Service:**
```bash
kubectl port-forward svc/gig-service 8082:8082
```

**Windows (PowerShell):**
```powershell
# Create a gig
Invoke-WebRequest -Uri http://localhost:8082/gigs -Method POST -ContentType "application/json" -Body '{"title":"Fix Lab Printer","description":"Paper jam in Lab 3","reward":50.0,"status":"OPEN"}'

# Get all gigs
Invoke-WebRequest -Uri http://localhost:8082/gigs -Method GET
```

**WSL/Linux/macOS:**
```bash
# Create a gig
curl -X POST http://localhost:8082/gigs \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix Lab Printer","description":"Paper jam in Lab 3","reward":50.0,"status":"OPEN"}'

# Get all gigs
curl http://localhost:8082/gigs
```

### Step 5: Frontend Demo (Simplified)

**Close other terminals** and run only this:

```bash
kubectl port-forward svc/frontend 3000:80
```

**Open Browser**: [http://localhost:3000](http://localhost:3000)

**Usage Flow**:
1. **Register as Professor**: Create account with role "Professor (Admin)"
2. **Post a Gig**: Create a new micro-internship task
3. **Logout and Register as Student**: Create a student account
4. **Apply for Gig**: Browse and apply for the posted gig
5. **Switch to Professor**: Logout and login as professor
6. **Approve & Pay**: Review application and approve with payment
7. **Check Student Wallet**: Login as student and verify wallet balance updated

### Step 6: Show Code & Tests (Optional)

**All Platforms:**
```bash
# Run unit tests for each service
cd user-service && mvn test
cd ../gig-service && mvn test
cd ../payment-service && mvn test
cd ../application-service && mvn test
```

### Step 7: Cleanup

```bash
# Delete all Kubernetes resources
kubectl delete -f k8s/

# Verify deletion
kubectl get all
```

</details>

---

## 🎤 Presentation Tips

### 1. Architecture Overview (2 minutes)
- Show the microservices architecture diagram (see [INFRASTRUCTURE.md](INFRASTRUCTURE.md))
- Explain service discovery with Eureka
- Highlight the Nginx reverse proxy pattern

### 2. Live Demo (5-7 minutes)
- Start with Eureka dashboard to show all services registered
- Demonstrate the complete workflow:
  - Professor creates gig
  - Student applies
  - Professor approves and pays
  - Student receives payment in wallet
- Show database in PgAdmin (optional)

### 3. Technical Deep Dive (3-5 minutes)
- Show Docker Compose configuration
- Explain containerization benefits
- Show Kubernetes manifests (if using K8s)
- Run unit tests to demonstrate code quality

### 4. Q&A Preparation

**Common Questions:**

**Q: Why microservices instead of monolith?**
- A: Scalability, independent deployment, technology flexibility, fault isolation

**Q: How do services communicate?**
- A: REST APIs, service discovery via Eureka, Nginx reverse proxy for frontend

**Q: What about database?**
- A: PostgreSQL with JPA/Hibernate, each service shares the same database (could be separated in production)

**Q: How is this deployed?**
- A: Docker Compose for local/demo, Kubernetes for production-like deployment

**Q: What testing is implemented?**
- A: Unit tests with JUnit, MockMvc for API testing, H2 in-memory DB for test isolation

---

## 🐛 Troubleshooting During Demo

### Services won't start

**Docker Compose:**
```bash
# Check logs
docker compose -f docker-compose-full.yml logs

# Restart specific service
docker compose -f docker-compose-full.yml restart user-service
```

**Kubernetes:**
```bash
# Check pod status
kubectl get pods

# Check logs
kubectl logs <pod-name>

# Restart deployment
kubectl rollout restart deployment/user-service
```

### Can't access localhost

- **Wait 2-3 minutes** for services to fully start
- Check if containers/pods are running
- Verify port-forwarding is active
- Try accessing Eureka dashboard first (http://localhost:8761)

### Database connection errors

**Docker Compose:**
```bash
# Check if PostgreSQL is healthy
docker ps

# Restart database
docker compose -f docker-compose-full.yml restart postgres
```

---

## 📊 Demo Checklist

Before the presentation:

- [ ] All services start successfully
- [ ] Eureka dashboard shows all services
- [ ] Frontend loads at localhost:3000
- [ ] Can create professor account
- [ ] Can create student account
- [ ] Can post a gig
- [ ] Can apply for a gig
- [ ] Can approve application
- [ ] Payment processes correctly
- [ ] Wallet balance updates

---

## 🎓 Additional Resources

- **[README.md](README.md)** - Quick start guide
- **[INFRASTRUCTURE.md](INFRASTRUCTURE.md)** - Architecture and deployment details
- **[KUBERNETES_SETUP.md](KUBERNETES_SETUP.md)** - Kubernetes setup guide
- **[api_reference.md](api_reference.md)** - API documentation
