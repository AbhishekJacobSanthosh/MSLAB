# UniGIG - Microinternships for Students

UniGIG is a microservices-based application for managing micro-internships in a college. It consists of 3 microservices and a service registry.

## Architecture

- **Eureka Server**: Service Registry (Port 8761)
- **User Service**: Manages users (Students, Faculty, etc.) (Port 8081)
- **Gig Service**: Manages gigs/tasks (Port 8082)
- **Payment Service**: Manages payments/rewards (Port 8083)

## Prerequisites

- Java 17+
- Maven
- Docker
- Kubernetes (Minikube or similar)

## Build Instructions

1.  **Build all services**:
    ```bash
    cd eureka-server && mvn clean package && cd ..
    cd user-service && mvn clean package && cd ..
    cd gig-service && mvn clean package && cd ..
    cd payment-service && mvn clean package && cd ..
    ```

2.  **Build Docker Images**:
    ```bash
    docker build -t eureka-server:latest ./eureka-server
    docker build -t user-service:latest ./user-service
    docker build -t gig-service:latest ./gig-service
    docker build -t payment-service:latest ./payment-service
    ```

## Deployment

1.  **Deploy to Kubernetes**:
    ```bash
    kubectl apply -f k8s/
    ```

2.  **Access Services**:
    - Use `kubectl port-forward` to access services locally if not using Ingress/NodePort.
    - Eureka: `http://localhost:8761`
    - User Service: `http://localhost:8081/users`
    - Gig Service: `http://localhost:8082/gigs`
    - Payment Service: `http://localhost:8083/payments`

## Testing

Run unit tests in each service directory:
```bash
mvn test
```
