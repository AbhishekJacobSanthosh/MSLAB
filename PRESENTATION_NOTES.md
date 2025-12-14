# UniGIG Project Presentation Guide

This document provides detailed explanations for each section of your project presentation. Use these notes to explain *why* things are built the way they are and to demonstrate your understanding of the underlying concepts.

## 1. Application Overview

### Application Name
**UniGIG - Micro-internships for Students**

### Problem Statement
"University students often struggle to find meaningful, short-term work experience relevant to their studies, while professors and campus departments lack a streamlined way to hire students for small, specific tasks."

### Why Microservices?
Instead of building a single "monolithic" app where the user, payment, and gig logic are all tangled together, we split them up.
*   **Scalability:** Imagine it's finals week and thousands of students are checking their profiles, but no one is making payments. In a monolith, we'd have to clone the *entire* server to handle the traffic. With microservices, we can just launch 5 more instances of the **User Service** while keeping the **Payment Service** small. This saves resources.
*   **Independent Deployment:** If we find a bug in the Payment logic, we can fix it and redeploy *only* the Payment Service. The Gig Service and User Service keep running without interruption. In a monolith, a bug in one module could crash the whole system, and fixing it requires restarting everything.

## 2. Microservices Architecture
This project is built on a **Microservices Architecture**. This means the application is a collection of small, autonomous services. Each service runs in its own process (its own container) and communicates with others using lightweight mechanisms (HTTP/REST).
*   **Key Concept:** "Do one thing and do it well." The User Service focuses *only* on user data; it doesn't know anything about gigs or payments.

## 3. List of Microservices
We have four core business services:

1.  **User Service (Port 8081):**
    *   **Role:** Acts as the "Identity Provider". It stores student and professor details (names, bios, skills).
    *   **Responsibility:** It handles authentication (login) and profile management. When other services need to know "Who is user 123?", they ask this service.

2.  **Gig Service (Port 8082):**
    *   **Role:** The "Core Product" service.
    *   **Responsibility:** Manages the lifecycle of a gig: Creation → Application (Student applies) → Approval (Professor accepts) → Completion. It holds the business logic for "Can this student apply?" and "Is the gig full?".

3.  **Payment Service (Port 8083):**
    *   **Role:** The "Financial Ledger".
    *   **Responsibility:** Manages the virtual currency/wallet for students. When a gig is finished, this service records the transaction. It keeps financial logic secure and separate from the rest of the app.

4.  **Application Service (Port 8084):**
    *   **Role:** The "Orchestrator" (optional in some designs, but here it likely separates the act of applying from the gig definition).
    *   **Responsibility:** Tracks the many-to-many relationship between Students and Gigs (e.g., "Student A applied to Gig B on Date X").

## 4. Communication Method
*   **Protocol:** **REST via HTTP**.
*   **How it works:** Services talk to each other just like a browser talks to a website.
    *   **Synchronous Communication:** When you mark a gig as "Complete", the Gig Service pauses and makes a real-time HTTP request to the User Service to add points.
    *   **Component:** We use **`RestTemplate`** (a Spring helper class) to make these calls.
    *   **Example from Code:**
        ```java
        // GigController.java
        restTemplate.postForEntity("http://user-service/users/" + id + "/credit", ...)
        ```
    *   **Trade-off:** It's simple to understand, but if the User Service is down, the Gig Service might hang or fail (this is a classic distributed system challenge).

## 5. Database per Service (No)
*   **Current State:** **Shared Database Pattern**.
*   **Explanation:** We use a single PostgreSQL instance (`unigig_db`) that all services connect to.
*   **Why we did this (The "Honest" Answer):** It simplifies deployment for a student project. We don't need to manage 4 separate database servers.
*   **The "Microservices" Answer:** ideally, we *should* use **Database per Service**.
    *   *Why?* If the Gig Team changes their table structure, they shouldn't accidentally break the Payment Service. Sharing a database couples the services tightly together, which breaks the rule of "independence".
    *   *Improvement:* In a production version, we would give each service its own logical database schema to ensure strict boundaries.

## 6. System Architecture Overview
The system is divided into three layers:
1.  **Client Layer:** The React Frontend (User Interface).
2.  **Gateway/Routing Layer:** Nginx (and potentially Spring Cloud Gateway in future) to route traffic.
3.  **Service Layer:** The cluster of Spring Boot applications (User, Gig, Payment) and the Eureka Server using a shared persistence layer (PostgreSQL).

## 7. Interaction between Services (Flow Example)
**Scenario: A Student completes a Gig.**
1.  **Browser:** Sends a `POST /api/gigs/101/complete` request to Nginx (Port 3000).
2.  **Nginx:** Sees `/api/gigs` and forwards the request to **Gig Service** (Port 8082).
3.  **Gig Service:**
    *   Updates the Gig status to `COMPLETED` in the database.
    *   **The Interaction:** It uses `RestTemplate` to call `POST http://user-service/credit`.
4.  **User Service:** Receives the request, adds 100 points to the student's profile in the database, and returns `200 OK`.
5.  **Gig Service:** Receives the OK and returns a success message to the browser.
This chain shows how services work together to complete a complex business action.

## 8. Service Discovery & Configuration
### Service Discovery (Eureka)
*   **The Problem:** In the cloud, services (containers) start and stop dynamically. Their IP addresses change all the time. We can't hardcode `http://192.168.1.5:8081` because that IP might belong to something else tomorrow.
*   **The Solution (Eureka):** It's like a phone book.
    1.  **Registration:** When `User Service` starts, it calls Eureka: *"Hi, I'm User Service, I'm at IP 172.18.0.5"*.
    2.  **Discovery:** When `Gig Service` needs to call `User Service`, it asks Eureka: *"Where is User Service?"*. Eureka replies with the current IP.
    3.  **Heartbeat:** Services send a pulse every 30 seconds. If `User Service` crashes, the pulse stops, and Eureka removes it from the phone book so no one calls a dead number.

### Configuration
*   **Approach:** We use **Container Environment Variables**.
*   **Explanation:** Instead of a complex central configuration server, we pass settings (like DB passwords) directly in the `docker-compose.yml` file. This is simple and effective for Docker deployments.

## 9. API Gateway
*   **Component:** **Nginx (Frontend Container)**.
*   **Why do we need it?**
    *   **Single Entry Point:** The frontend only needs to know one URL (`localhost:3000`). It doesn't need to know that Users are on 8081 and Payments are on 8083.
    *   **Security (CORS):** Browsers hate it when a site on `port 3000` tries to talk to `port 8081`. The Gateway makes everything look like it's coming from the same place (Same-Origin Policy).
    *   **Routing:** It acts as a traffic director.
        *   Request to `/api/users/*` -> go to User Container.
        *   Request to `/` -> serve the React index.html.

## 10. Design Challenges
*   **Data Consistency:** Since "Completing a Gig" involves writing to the Gig Table AND the User Table, what happens if the first write succeeds but the second fails? In a monolith, we'd use a database transaction to roll back. In microservices, we can't easily do that. We might end up with a completed gig but no points credited (Data Interaction Challenge).
*   **Latency:** One function call in code is nanoseconds. One HTTP call between services is milliseconds. Chaining too many service calls together makes the app slow.

## 11. Deployment and Monitoring Challenges
*   **Deployment Complexity:** To run valid tests, we have to spin up 5+ containers in the correct order. If the Database takes 10 seconds to start, the services might crash if they try to connect at second 5. We solved this using Docker `healthcheck` and `depends_on`.
*   **Monitoring (The "Black Box" Problem):** When something goes wrong, it's hard to know *where*. Did the Frontend send the wrong data? Did the Gig Service crash? Did the DB timeout? We have to check 5 different log files. In a real system, we'd add Distributed Tracing (like Zipkin) to visualize the path of a request across all services.
