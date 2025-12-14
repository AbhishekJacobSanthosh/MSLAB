# UniGIG API Workflow (Postman Guide)

This guide provides the **exact** URLs and JSON bodies you need to test the entire UniGIG workflow in Postman.

**Prerequisite:** Ensure all services are running (`docker compose -f docker-compose-full.yml up`).

---

## Phase 1: User Setup
We need to create two users: one **Professor** (to post gigs) and one **Student** (to apply).

### 1. Create Professor Account
*   **Method:** `POST`
*   **URL:** `http://localhost:8081/users`
*   **Body (JSON):**
    ```json
    {
        "name": "Dr. Sarah Smith",
        "email": "sarah.smith@university.edu",
        "password": "securepass123",
        "role": "PROFESSOR",
        "bio": "Professor of Computer Science",
        "skills": "Java, Cloud Computing, AI"
    }
    ```
*   **Expected Result:** Returns User Object with `id: 1` (or similar).

### 2. Create Student Account
*   **Method:** `POST`
*   **URL:** `http://localhost:8081/users`
*   **Body (JSON):**
    ```json
    {
        "name": "John Doe",
        "email": "john.doe@university.edu",
        "password": "studentpass123",
        "role": "STUDENT",
        "bio": "Sophomore CS Student seeking web dev gigs",
        "skills": "React, JavaScript, HTML, CSS"
    }
    ```
*   **Expected Result:** Returns User Object with `id: 2`.

---

## Phase 2: Posting a Gig (Professor)
The professor posts a new micro-internship opportunity.

### 3. Create a New Gig
*   **Method:** `POST`
*   **URL:** `http://localhost:8082/gigs`
*   **Body (JSON):**
    ```json
    {
        "title": "Fix Frontend Bug",
        "description": "Fix the alignment issue on the dashboard navbar",
        "reward": 50.00,
        "status": "OPEN",
        "maxPositions": 1
    }
    ```
*   **Expected Result:** Returns Gig Object with `id: 1` and `status: "OPEN"`.

---

## Phase 3: Application Process (Student)
The student views the gig and applies.

### 4. View All Gigs
*   **Method:** `GET`
*   **URL:** `http://localhost:8082/gigs`
*   **Body:** None
*   **Note:** Verify the gig ID from step 3 is in the list.

### 5. Apply for the Gig
*   **Method:** `POST`
*   **URL:** `http://localhost:8084/applications`
*   **Body (JSON):**
    ```json
    {
        "gigId": 1,
        "studentId": 2
    }
    ```
*   **Expected Result:** Returns Application Object with `status: "PENDING"`.

---

## Phase 4: Review Application (Professor)
The professor sees the application and approves it.

### 6. View Applications for the Gig
*   **Method:** `GET`
*   **URL:** `http://localhost:8084/applications/gig/1`
*   **Body:** None
*   **Expected Result:** Returns list containing the application from Step 5. Note the `id` of this application (e.g., `1`).

### 7. Approve the Application
*   **Method:** `PUT`
*   **URL:** `http://localhost:8084/applications/1/approve`
    *   *Replace `1` with the actual Application ID from Step 6.*
*   **Body:** None
*   **Effect:**
    1.  Updates Application status to `APPROVED`.
    2.  Updates Gig (in Gig Service) to add Student ID `2` to `studentIds`.
    3.  If Gig is full, updates Gig status to `ASSIGNED`.

---

## Phase 5: Completion & Payment (Professor)
The work is done. The professor marks it as complete and pays the student.

### 8. Verify Transaction History (Before Payment)
*   **Method:** `GET`
*   **URL:** `http://localhost:8083/payments/user/2`
    *   *Replace `2` with Student ID.*
*   **Expected Result:** Empty list `[]` (Student has no money yet).

### 9. Process Payment
*   **Method:** `POST`
*   **URL:** `http://localhost:8083/payments`
*   **Body (JSON):**
    ```json
    {
        "userId": 2,
        "gigId": 1,
        "amount": 50.00
    }
    ```
    *   *Note: `userId` is the Student ID.*

### 10. Delete/Archive the Gig
*   **Method:** `DELETE`
*   **URL:** `http://localhost:8082/gigs/1`
*   **Body:** None

---

## Phase 6: Verification (Student)
Check that the student user received the money.

### 11. Check Student Wallet
*   **Method:** `GET`
*   **URL:** `http://localhost:8083/payments/user/2`
*   **Expected Result:** List containing one transaction of `$50.00`.

### 12. Check Student Credits/Points (Optional)
*   **Method:** `POST`
*   **URL:** `http://localhost:8081/users/2/credit?points=10&gigs=1`
    *   *Note 1: The payment service doesn't automatically call this in the current code (frontend handles payment separately).*
    *   *Note 2: Use query parameters `?points=...` exactly as shown.*
