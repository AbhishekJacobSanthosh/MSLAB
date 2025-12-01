# UniGIG Demo Guide

Follow these steps to demonstrate the project to your professor.

## 1. Start Kubernetes & Deploy
Ensure your Kubernetes cluster (e.g., Minikube) is running.

```bash
# Apply all deployment and service configurations
kubectl apply -f k8s/

# Wait for pods to be ready (Status: Running)
kubectl get pods
```

## 2. Show Service Discovery (Eureka)
Demonstrate that all microservices are registered.

1.  **Port Forward Eureka**:
    ```bash
    # Open a new terminal
    kubectl port-forward svc/eureka-server 8761:8761
    ```
2.  **Open Browser**: Go to [http://localhost:8761](http://localhost:8761).
3.  **Show**: You should see `USER-SERVICE`, `GIG-SERVICE`, and `PAYMENT-SERVICE` listed under "Instances currently registered with Eureka".

## 3. Demonstrate User Service
Show that you can create and retrieve users.

1.  **Port Forward User Service**:
    ```bash
    # Open a new terminal
    kubectl port-forward svc/user-service 8081:8081
    ```

2.  **Create a Student**:
    ```bash
    curl -X POST http://localhost:8081/users \
         -H "Content-Type: application/json" \
         -d '{"name": "Alice Student", "email": "alice@college.edu", "role": "STUDENT"}'
    ```

3.  **Get All Users**:
    ```bash
    curl http://localhost:8081/users
    ```

## 4. Demonstrate Gig Service
Show that you can create and retrieve gigs.

1.  **Port Forward Gig Service**:
    ```bash
    # Open a new terminal
    kubectl port-forward svc/gig-service 8082:8082
    ```

2.  **Create a Gig**:
    ```bash
    curl -X POST http://localhost:8082/gigs \
         -H "Content-Type: application/json" \
         -d '{"title": "Fix Lab Printer", "description": "Paper jam in Lab 3", "reward": 50.0, "status": "OPEN"}'
    ```

3.  **Get All Gigs**:
    ```bash
    curl http://localhost:8082/gigs
    ```

## 5. Frontend Demo (Simplified)

We have implemented an **Nginx Reverse Proxy**, so you only need ONE terminal.

1.  **Port-Forward ONLY the Frontend**:
    Close all other terminals and run just this:
    ```bash
    kubectl port-forward svc/frontend 3000:80
    ```

2.  **Access the App**:
    Open your browser and go to: [http://localhost:3000](http://localhost:3000)

3.  **Usage Flow**:
    - **Login**: Enter any name (e.g., "Alice") and choose "Student" or "Professor".
    - **Professor (Admin)**: Post a new gig.
    - **Student**: View the gig and click "Apply".
    - **Professor**: See the assigned gig and click "Approve & Pay".
    - **Student**: Check the "Wallet Balance" in the dashboard.
    ```

## 6. Show Code & Tests
If asked, show the project structure and run tests:

```bash
cd user-service && mvn test
cd gig-service && mvn test
cd payment-service && mvn test
```
