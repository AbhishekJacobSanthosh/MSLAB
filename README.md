# UniGIG - Microinternships for Students

UniGIG is a microservices-based application for managing micro-internships in a college. It consists of 3 microservices and a service registry.

## Architecture

- **Eureka Server**: Service Registry (Port 8761)
- **User Service**: Manages users (Students, Faculty, etc.) (Port 8081)
- **Gig Service**: Manages gigs/tasks (Port 8082)
-   **Application Service**: Manages internship applications (Port 8084)

## Architecture

The system uses a microservices architecture with the following components:

-   **Eureka Server** (8761): Service Discovery
-   **User Service** (8081): User Management
-   **Gig Service** (8082): Gig Inventory
-   **Payment Service** (8083): Payments & Wallets
-   **Application Service** (8084): Application Workflow

## Features

### 1. Student Profiles
-   Students can create profiles with **Bio** and **Skills**.
-   These details are visible to Professors when applying.

### 2. Approval Workflow
-   Applications start as **PENDING**.
-   Professors review applications on their dashboard.
-   Professors can **Approve** (assigns gig) or **Reject** applications.

### 3. Advanced Gig Management
-   **Application Limit**: Students are limited to **3 PENDING applications** at a time to encourage thoughtful applying.
-   **Multi-Student Gigs**: Professors can set "Max Positions" for a gig, allowing multiple students to be approved for the same task.
-   **Manual Delete**: Professors can delete gigs.
-   **Auto-Remove**: Gigs are automatically removed/archived upon completion and payment.

### 4. Modern UI
-   Sleek **Dark Mode** design.
-   Glassmorphism aesthetic for cards and navigation.
-   Responsive and spacious layout.

## Build Instructions

1.  **Run with Docker Compose** (Recommended):
    ```bash
    docker compose -f docker-compose-full.yml up --build -d

    docker compose -f docker-compose-full.yml down for shutdown
    ```

    This will build and start all microservices, databases, and the frontend.

2.  **Access the Application**:
    -   **Frontend**: [http://localhost:3000](http://localhost:3000)
    -   **Eureka Dashboard**: [http://localhost:8761](http://localhost:8761)
    -   **PgAdmin**: [http://localhost:5050](http://localhost:5050)

## Tech Stack
-   **Backend**: Java, Spring Boot, Spring Cloud Eureka
-   **Frontend**: React, Vite, Axios
-   **Database**: PostgreSQL
-   **Containerization**: Docker, Docker Compose
