# UniGIG - Microinternships for Students

UniGIG is a microservices-based application for managing micro-internships in a college. It consists of 4 microservices, a service registry, and a modern React frontend.

---

## 📦 Architecture

The system uses a microservices architecture with the following components:

- **Eureka Server** (8761): Service Discovery & Registry
- **User Service** (8081): User Management (Students, Professors)
- **Gig Service** (8082): Gig/Task Inventory
- **Payment Service** (8083): Payments & Wallets
- **Application Service** (8084): Application Workflow
- **Frontend** (3000): React + Nginx Reverse Proxy
- **PostgreSQL** (5432): Database
- **PgAdmin** (5050): Database Management UI

---

## ✨ Features

### 1. Student Profiles
- Students can create profiles with **Bio** and **Skills**
- Profile details are visible to Professors when reviewing applications

### 2. Approval Workflow
- Applications start as **PENDING**
- Professors review applications on their dashboard
- Professors can **Approve** (assigns gig) or **Reject** applications

### 3. Advanced Gig Management
- **Application Limit**: Students are limited to **3 PENDING applications** at a time
- **Multi-Student Gigs**: Professors can set "Max Positions" for a gig
- **Manual Delete**: Professors can delete gigs
- **Auto-Remove**: Gigs are automatically archived upon completion and payment

### 4. Modern UI
- Sleek **Dark Mode** design
- Glassmorphism aesthetic for cards and navigation
- Responsive and spacious layout

---

## 🚀 Quick Start

### Prerequisites

Choose your platform and follow the corresponding instructions:

<details>
<summary><b>🪟 Windows</b></summary>

**Option 1: Docker Desktop (Recommended)**
1. Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Ensure WSL2 backend is enabled (Docker Desktop will prompt you)
3. Start Docker Desktop

**Option 2: WSL2 + Docker Engine**
- See the WSL/Linux section below

</details>

<details>
<summary><b>🐧 WSL/Linux</b></summary>

**Install Docker Engine:**
```bash
# Update package index
sudo apt update

# Install Docker
sudo apt install -y docker.io docker-compose

# Start Docker service
sudo service docker start

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
```

</details>

<details>
<summary><b>🍎 macOS</b></summary>

1. Download and install [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. Start Docker Desktop
3. Verify installation:
   ```bash
   docker --version
   ```

</details>

---

## 🏃 Running the Application

### Method 1: Docker Compose (Recommended for All Platforms)

This works identically on **Windows**, **WSL**, **Linux**, and **macOS**.

#### Step 1: Clone the Repository

**Windows (PowerShell/CMD):**
```powershell
git clone https://github.com/yourusername/MSLab-project.git
cd MSLab-project\MSLAB
```

**WSL/Linux/macOS:**
```bash
git clone https://github.com/yourusername/MSLab-project.git
cd MSLab-project/MSLAB
```

#### Step 2: Start All Services

**All Platforms:**
```bash
docker compose -f docker-compose-full.yml up --build -d
```

This command will:
- Build all Docker images (backend services + frontend)
- Start PostgreSQL database
- Start all microservices
- Start the frontend with Nginx reverse proxy
- Start PgAdmin for database management

#### Step 3: Wait for Services to Start

```bash
# Check if all containers are running
docker ps

# Watch logs (optional)
docker compose -f docker-compose-full.yml logs -f
```

Wait until you see messages like:
- "Started EurekaServerApplication"
- "Started UserServiceApplication"
- "Started GigServiceApplication"
- etc.

#### Step 4: Access the Application

Open your browser and navigate to:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Eureka Dashboard**: [http://localhost:8761](http://localhost:8761)
- **PgAdmin**: [http://localhost:5050](http://localhost:5050)
  - Email: `admin@unigig.com`
  - Password: `password`

#### Step 5: Stop the Application

**All Platforms:**
```bash
docker compose -f docker-compose-full.yml down
```

---

### Method 2: Kubernetes (Advanced)

For Kubernetes deployment, see **[KUBERNETES_SETUP.md](KUBERNETES_SETUP.md)** for detailed instructions.

**Quick Summary:**
- **Windows**: Use Docker Desktop with Kubernetes enabled, or WSL2 + Minikube
- **WSL/Linux**: Use Minikube (see full guide)
- **macOS**: Use Docker Desktop with Kubernetes enabled, or Minikube

---

## 📚 Additional Documentation

- **[INFRASTRUCTURE.md](INFRASTRUCTURE.md)** - Detailed architecture, deployment options, and infrastructure overview
- **[KUBERNETES_SETUP.md](KUBERNETES_SETUP.md)** - Complete Kubernetes setup guide for WSL2/Linux
- **[demo_guide.md](demo_guide.md)** - Step-by-step demo instructions for presentations
- **[api_reference.md](api_reference.md)** - API endpoints documentation

---

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3.2, Spring Cloud Eureka
- **Frontend**: React 18, Vite, Axios
- **Database**: PostgreSQL 16
- **Containerization**: Docker, Docker Compose, Kubernetes
- **Reverse Proxy**: Nginx

---

## 🐛 Troubleshooting

### Issue: "Port already in use"

**All Platforms:**
```bash
# Stop conflicting services
docker compose -f docker-compose-full.yml down

# Check what's using the port (example: port 3000)
# Windows (PowerShell):
netstat -ano | findstr :3000

# WSL/Linux/macOS:
lsof -i :3000
```

### Issue: Docker containers won't start

**Windows:**
- Ensure Docker Desktop is running
- Check WSL2 integration in Docker Desktop settings

**WSL/Linux:**
```bash
# Start Docker service
sudo service docker start

# Check Docker status
sudo service docker status
```

### Issue: Can't access localhost:3000

**All Platforms:**
- Wait 2-3 minutes for all services to fully start
- Check container logs: `docker compose -f docker-compose-full.yml logs frontend`
- Verify containers are running: `docker ps`

### Issue: Database connection errors

**All Platforms:**
- Ensure PostgreSQL container is healthy: `docker ps`
- Check logs: `docker compose -f docker-compose-full.yml logs postgres`
- Restart services: `docker compose -f docker-compose-full.yml restart`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- Your Name - Initial work

---

## 🙏 Acknowledgments

- Spring Boot & Spring Cloud for microservices framework
- React & Vite for modern frontend development
- Docker for containerization
