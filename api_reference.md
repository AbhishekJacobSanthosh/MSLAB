# UniGIG API Reference

Base URL (Gateway/Frontend Proxy): `http://localhost:3000/api`  
Base URL (Direct Services): See specific ports below.

## 1. User Service (Port 8081)
**Base URL:** `http://localhost:8081/users` (or `/api/users` via Gateway)

| Method | Endpoint | Description | Body / Notes |
| :--- | :--- | :--- | :--- |
| **POST** | `/login` | User Login | `{ "username": "Student", "password": "password" }` |
| **GET** | `/` | List All Users | - |
| **GET** | `/{id}` | Get User Details | - |
| **PATCH** | `/{id}` | Update Profile | `{ "bio": "My bio...", "skills": "Java, React" }` |
| **POST** | `/` | Create User | `{ "username": "newuser", "password": "123", "role": "STUDENT" }` |

---

## 2. Gig Service (Port 8082)
**Base URL:** `http://localhost:8082/gigs` (or `/api/gigs` via Gateway)

| Method | Endpoint | Description | Body / Notes |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Create Gig | `{ "title": "Fix Bug", "description": "Fix NPE", "reward": 50, "maxPositions": 2 }` |
| **GET** | `/` | List All Gigs | - |
| **GET** | `/{id}` | Get Gig | - |
| **PUT** | `/{id}` | Update Gig | Full Gig Object |
| **DELETE**| `/{id}` | Delete Gig | - |

---

## 3. Application Service (Port 8084)
**Base URL:** `http://localhost:8084/applications` (or `/api/applications` via Gateway)

| Method | Endpoint | Description | Body / Notes |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Apply for Gig | `{ "gigId": 1, "studentId": 2 }` |
| **GET** | `/student/{id}` | Student's Apps | - |
| **GET** | `/gig/{id}` | Gig's Apps | - |
| **PUT** | `/{id}/approve` | Approve App | - |
| **PUT** | `/{id}/reject` | Reject App | - |

---

## 4. Payment Service (Port 8083)
**Base URL:** `http://localhost:8083/payments` (or `/api/payments` via Gateway)

| Method | Endpoint | Description | Body / Notes |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Make Payment | `{ "userId": 2, "gigId": 1, "amount": 50 }` |
| **GET** | `/user/{id}` | Get Wallet | - |

---

## Service Discovery (Eureka)
- **URL**: `http://localhost:8761`
- Check this dashboard to ensure all services (`USER-SERVICE`, `GIG-SERVICE`, etc.) are UP.
