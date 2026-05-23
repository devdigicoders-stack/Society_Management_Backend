# Society Portal API Documentation

This document contains a comprehensive reference of all API endpoints available in the **Society Portal Backend**. 

---

## 🚀 Overview & General Info

### Base URL
Depending on your environment setup, the local base URL is generally:
`http://localhost:<PORT>` (e.g., `http://localhost:5000`)

### Role Definitions
Users belong to one of the following roles, which control access to specific endpoints:
1. `SUPER_ADMIN` - Fully manages users, approvals, guards, and system metrics.
2. `MANAGER` - Oversees society operations, views reports, guards, and flat owner lists.
3. `FLAT_OWNER` - Manages flat owner profile, daily staff, and guest pre-approvals/approvals.
4. `GUARD` - Handles gate security, creates guest entries, and marks guest check-ins/check-outs.

---

## 🔒 Authentication & Headers

All protected endpoints require the client to supply a JWT (JSON Web Token) in the `Authorization` header.

### Request Headers
- **Content-Type**: `application/json` (Required for endpoints that accept a body)
- **Authorization**: `Bearer <JWT_TOKEN>` (Required for all protected routes)

### Standard Response Format

#### Success Responses
```json
{
  "success": true,
  "message": "Operation description string",
  "data": { ... } // Or [ ... ] for list endpoints
}
```

#### Error Responses
```json
{
  "success": false,
  "message": "Error details or explanation"
}
```

---

## 📂 Table of Contents
1. [Test & Utility Endpoints](#1-test--utility-endpoints)
2. [Authentication Endpoints](#2-authentication-endpoints)
3. [User Management Endpoints](#3-user-management-endpoints)
4. [Flat Owner Profile Endpoints](#4-flat-owner-profile-endpoints)
5. [Guard Profile Endpoints](#5-guard-profile-endpoints)
6. [Guest Entries & Approvals Endpoints](#6-guest-entries--approvals-endpoints)
7. [Daily Staff Management Endpoints](#7-daily-staff-management-endpoints)

---

## 1. Test & Utility Endpoints

### `GET /` (Server Health Check)
Checks if the API server is up and running.

- **Authentication**: Public
- **Headers**:
  - `Accept: application/json`
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Society Portal API Running"
  }
  ```

---

### `GET /api/test/super-admin` (Super Admin Test Route)
Used to verify that the Super Admin role check is functioning properly.

- **Authentication**: Required (`SUPER_ADMIN` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Welcome Super Admin",
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Super Admin User",
      "email": "admin@societyportal.com",
      "phone": "+919876543210",
      "role": "SUPER_ADMIN",
      "isApproved": true,
      "isBlocked": false,
      "createdAt": "2026-05-20T12:00:00.000Z",
      "updatedAt": "2026-05-20T12:00:00.000Z"
    }
  }
  ```

---

## 2. Authentication Endpoints

### `POST /api/auth/register` (Register User)
Creates a new user in the system. The user remains inactive/unapproved until a `SUPER_ADMIN` approves them.

- **Authentication**: Public
- **Headers**:
  - `Content-Type: application/json`
- **Request Body Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | String | **Yes** | Full name of the user |
  | `email` | String | No | User's email address |
  | `phone` | String | **Yes** | Phone number (used as unique login identifier) |
  | `password` | String | **Yes** | Passphrase (minimum 6 characters) |
  | `role` | String | No | One of `SUPER_ADMIN`, `MANAGER`, `FLAT_OWNER`, `GUARD`. Defaults to `FLAT_OWNER`. |

- **Sample Request**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "+919988776655",
    "password": "securepassword123",
    "role": "FLAT_OWNER"
  }
  ```

- **Successful Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "id": "60d0fe4f5311236168a109cb",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "+919988776655",
      "role": "FLAT_OWNER",
      "isApproved": false
    }
  }
  ```

- **Error Responses**:
  - `400 Bad Request` (If user already exists):
    ```json
    {
      "success": false,
      "message": "User already exists"
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "success": false,
      "message": "Detailed system error stack trace or explanation"
    }
    ```

---

### `POST /api/auth/login` (Login User)
Authenticates user by phone and password. Generates a session JWT token valid for 7 days.

- **Authentication**: Public
- **Headers**:
  - `Content-Type: application/json`
- **Request Body Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `phone` | String | **Yes** | Registered phone number |
  | `password` | String | **Yes** | User password |

- **Sample Request**:
  ```json
  {
    "phone": "+919988776655",
    "password": "securepassword123"
  }
  ```

- **Successful Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDBmZTRmNTMxMTIzNjE2OGExMDljYiIsInJvbGUiOiJGTEFUX09XTkVSIiwiaWF0IjoxNzgxNTUwNDAwLCJleHAiOjE3ODIxNTUyMDB9...",
    "user": {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "+919988776655",
      "role": "FLAT_OWNER",
      "isApproved": true,
      "isBlocked": false,
      "createdAt": "2026-05-20T12:00:00.000Z",
      "updatedAt": "2026-05-20T12:00:00.000Z"
    }
  }
  ```

- **Error Responses**:
  - `400 Bad Request` (Invalid credentials):
    ```json
    {
      "success": false,
      "message": "Invalid credentials"
    }
    ```
  - `403 Forbidden` (If account not approved yet):
    ```json
    {
      "success": false,
      "message": "Account not approved"
    }
    ```
  - `403 Forbidden` (If account is blocked):
    ```json
    {
      "success": false,
      "message": "Account blocked"
    }
    ```

---

## 3. User Management Endpoints

All endpoints in this section are protected and only accessible by a **SUPER_ADMIN**.

### `GET /api/users` (Get All Users)
Retrieves the list of all registered users in the database, ordered by creation date descending. Passwords are excluded from selection.

- **Authentication**: Required (`SUPER_ADMIN` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "60d0fe4f5311236168a109cb",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "phone": "+919988776655",
        "role": "FLAT_OWNER",
        "isApproved": true,
        "isBlocked": false,
        "createdAt": "2026-05-20T12:05:00.000Z",
        "updatedAt": "2026-05-20T12:10:00.000Z"
      },
      {
        "_id": "60d0fe4f5311236168a109cc",
        "name": "Guard Duty",
        "email": "guard@example.com",
        "phone": "+919900000001",
        "role": "GUARD",
        "isApproved": false,
        "isBlocked": false,
        "createdAt": "2026-05-20T12:02:00.000Z",
        "updatedAt": "2026-05-20T12:02:00.000Z"
      }
    ]
  }
  ```

---

### `PATCH /api/users/:id/approve` (Approve User)
Approves a user account to allow them to log in.

- **Authentication**: Required (`SUPER_ADMIN` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the user to approve.
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "User approved successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cc",
      "name": "Guard Duty",
      "email": "guard@example.com",
      "phone": "+919900000001",
      "role": "GUARD",
      "isApproved": true,
      "isBlocked": false,
      "createdAt": "2026-05-20T12:02:00.000Z",
      "updatedAt": "2026-05-20T12:15:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found` (User not found):
    ```json
    {
      "success": false,
      "message": "User not found"
    }
    ```

---

### `PATCH /api/users/:id/block` (Block User)
Blocks a user account to prevent login/access.

- **Authentication**: Required (`SUPER_ADMIN` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the user to block.
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "User blocked successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "+919988776655",
      "role": "FLAT_OWNER",
      "isApproved": true,
      "isBlocked": true,
      "createdAt": "2026-05-20T12:05:00.000Z",
      "updatedAt": "2026-05-20T12:20:00.000Z"
    }
  }
  ```

---

### `PATCH /api/users/:id/unblock` (Unblock User)
Unblocks a user account.

- **Authentication**: Required (`SUPER_ADMIN` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the user to unblock.
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "User unblocked successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "+919988776655",
      "role": "FLAT_OWNER",
      "isApproved": true,
      "isBlocked": false,
      "createdAt": "2026-05-20T12:05:00.000Z",
      "updatedAt": "2026-05-20T12:25:00.000Z"
    }
  }
  ```

---

## 4. Flat Owner Profile Endpoints

Endpoints here relate to the profile details of flat owners.

### `POST /api/flat-owners/profile` (Create Profile)
Creates a detailed profile for a logged-in `FLAT_OWNER` user.

- **Authentication**: Required (`FLAT_OWNER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
  - `Content-Type: application/json`
- **Request Body Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `societyName` | String | **Yes** | Name of the residential society |
  | `tower` | String | **Yes** | Tower name/letter (e.g., "A", "Tower 3") |
  | `floor` | String | **Yes** | Floor number (e.g., "4", "4th") |
  | `flatNumber` | String | **Yes** | Flat designation (e.g., "402") |
  | `familyMembers`| Number | No | Number of residing family members. Defaults to `0` |
  | `vehicleNumbers`| Array (Strings) | No | List of vehicle license plate numbers |

- **Sample Request**:
  ```json
  {
    "societyName": "Green Valley Heights",
    "tower": "Block B",
    "floor": "7",
    "flatNumber": "704",
    "familyMembers": 4,
    "vehicleNumbers": ["DL-3C-AB-1234", "DL-3C-CD-5678"]
  }
  ```

- **Successful Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Flat owner profile created",
    "data": {
      "_id": "60d0fe4f5311236168a109cd",
      "user": "60d0fe4f5311236168a109cb",
      "societyName": "Green Valley Heights",
      "tower": "Block B",
      "floor": "7",
      "flatNumber": "704",
      "familyMembers": 4,
      "vehicleNumbers": ["DL-3C-AB-1234", "DL-3C-CD-5678"],
      "createdAt": "2026-05-20T12:30:00.000Z",
      "updatedAt": "2026-05-20T12:30:00.000Z"
    }
  }
  ```

- **Error Responses**:
  - `400 Bad Request` (If profile already exists for the user):
    ```json
    {
      "success": false,
      "message": "Flat owner profile already exists"
    }
    ```

---

### `GET /api/flat-owners/profile/me` (Get My Profile)
Fetches the detailed profile of the currently logged-in Flat Owner, along with populated user data.

- **Authentication**: Required (`FLAT_OWNER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f5311236168a109cd",
      "user": {
        "_id": "60d0fe4f5311236168a109cb",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "phone": "+919988776655",
        "role": "FLAT_OWNER"
      },
      "societyName": "Green Valley Heights",
      "tower": "Block B",
      "floor": "7",
      "flatNumber": "704",
      "familyMembers": 4,
      "vehicleNumbers": ["DL-3C-AB-1234", "DL-3C-CD-5678"],
      "createdAt": "2026-05-20T12:30:00.000Z",
      "updatedAt": "2026-05-20T12:30:00.000Z"
    }
  }
  ```

---

### `GET /api/flat-owners/` (Get All Flat Owners)
Retrieves all Flat Owner profiles inside the portal. Useful for administrative staff to lookup residents.

- **Authentication**: Required (`SUPER_ADMIN` or `MANAGER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "60d0fe4f5311236168a109cd",
        "user": {
          "_id": "60d0fe4f5311236168a109cb",
          "name": "John Doe",
          "email": "johndoe@example.com",
          "phone": "+919988776655",
          "role": "FLAT_OWNER",
          "isApproved": true,
          "isBlocked": false
        },
        "societyName": "Green Valley Heights",
        "tower": "Block B",
        "floor": "7",
        "flatNumber": "704",
        "familyMembers": 4,
        "vehicleNumbers": ["DL-3C-AB-1234", "DL-3C-CD-5678"],
        "createdAt": "2026-05-20T12:30:00.000Z",
        "updatedAt": "2026-05-20T12:30:00.000Z"
      }
    ]
  }
  ```

---

## 5. Guard Profile Endpoints

Endpoints in this section represent security guard configurations.

### `POST /api/guards/profile` (Create Guard Profile)
Creates a detailed operational profile for a logged-in `GUARD`.

- **Authentication**: Required (`GUARD` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
  - `Content-Type: application/json`
- **Request Body Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `societyName` | String | **Yes** | The society gate where the guard operates |
  | `shift` | String | **Yes** | Guard shift. Must be either `MORNING`, `EVENING`, or `NIGHT` |
  | `gateNumber` | String | **Yes** | Gate designation code/number (e.g. "Gate 1") |

- **Sample Request**:
  ```json
  {
    "societyName": "Green Valley Heights",
    "shift": "MORNING",
    "gateNumber": "1"
  }
  ```

- **Successful Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Guard profile created successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109ce",
      "user": "60d0fe4f5311236168a109cc",
      "societyName": "Green Valley Heights",
      "shift": "MORNING",
      "gateNumber": "1",
      "createdAt": "2026-05-20T12:35:00.000Z",
      "updatedAt": "2026-05-20T12:35:00.000Z"
    }
  }
  ```

- **Error Responses**:
  - `400 Bad Request` (If guard profile already exists for the user):
    ```json
    {
      "success": false,
      "message": "Guard profile already exists"
    }
    ```

---

### `GET /api/guards/profile/me` (Get My Profile)
Fetches the profile info of the logged-in Guard.

- **Authentication**: Required (`GUARD` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f5311236168a109ce",
      "user": {
        "_id": "60d0fe4f5311236168a109cc",
        "name": "Guard Duty",
        "email": "guard@example.com",
        "phone": "+919900000001",
        "role": "GUARD"
      },
      "societyName": "Green Valley Heights",
      "shift": "MORNING",
      "gateNumber": "1",
      "createdAt": "2026-05-20T12:35:00.000Z",
      "updatedAt": "2026-05-20T12:35:00.000Z"
    }
  }
  ```

---

### `GET /api/guards/` (Get All Guards)
Retrieves all registered Guard profiles.

- **Authentication**: Required (`SUPER_ADMIN` or `MANAGER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "60d0fe4f5311236168a109ce",
        "user": {
          "_id": "60d0fe4f5311236168a109cc",
          "name": "Guard Duty",
          "email": "guard@example.com",
          "phone": "+919900000001",
          "role": "GUARD",
          "isApproved": true,
          "isBlocked": false
        },
        "societyName": "Green Valley Heights",
        "shift": "MORNING",
        "gateNumber": "1",
        "createdAt": "2026-05-20T12:35:00.000Z",
        "updatedAt": "2026-05-20T12:35:00.000Z"
      }
    ]
  }
  ```

---

## 6. Guest Entries & Approvals Endpoints

Used to handle visitor/guest check-in workflows at the gate.

### `POST /api/guests/` (Create Guest Entry)
A security guard creates a new guest entry workflow. This logs the entry in `PENDING` state and fires an approval alert to the resident (`flatOwner`).

- **Authentication**: Required (`GUARD` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
  - `Content-Type: application/json`
- **Request Body Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `flatOwner` | String | **Yes** | MongoDB ObjectId of the destination flat owner user |
  | `guestName` | String | **Yes** | Name of the guest |
  | `guestPhone`| String | **Yes** | Guest phone number |
  | `purpose` | String | **Yes** | Purpose of visit (e.g. "Delivery", "Personal") |
  | `vehicleNumber`| String| No | Guest vehicle plate number if applicable |
  | `photo` | String | No | Base64 URL or image link of guest photo. Defaults to empty string |

- **Sample Request**:
  ```json
  {
    "flatOwner": "60d0fe4f5311236168a109cb",
    "guestName": "Alice Smith",
    "guestPhone": "+919898989898",
    "purpose": "Personal Visit",
    "vehicleNumber": "DL-1A-AA-9999",
    "photo": "https://example.com/uploads/alice.png"
  }
  ```

- **Successful Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Guest entry sent for approval",
    "data": {
      "_id": "60d0fe4f5311236168a109cf",
      "guard": "60d0fe4f5311236168a109cc",
      "flatOwner": "60d0fe4f5311236168a109cb",
      "guestName": "Alice Smith",
      "guestPhone": "+919898989898",
      "purpose": "Personal Visit",
      "vehicleNumber": "DL-1A-AA-9999",
      "photo": "https://example.com/uploads/alice.png",
      "status": "PENDING",
      "createdAt": "2026-05-20T12:40:00.000Z",
      "updatedAt": "2026-05-20T12:40:00.000Z"
    }
  }
  ```

---

### `GET /api/guests/my-requests` (Get My Guest Requests)
Fetches all guest entry requests destined for the currently logged-in Flat Owner, along with populated guard details.

- **Authentication**: Required (`FLAT_OWNER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "60d0fe4f5311236168a109cf",
        "guard": {
          "_id": "60d0fe4f5311236168a109cc",
          "name": "Guard Duty",
          "phone": "+919900000001",
          "role": "GUARD"
        },
        "flatOwner": "60d0fe4f5311236168a109cb",
        "guestName": "Alice Smith",
        "guestPhone": "+919898989898",
        "purpose": "Personal Visit",
        "vehicleNumber": "DL-1A-AA-9999",
        "photo": "https://example.com/uploads/alice.png",
        "status": "PENDING",
        "createdAt": "2026-05-20T12:40:00.000Z",
        "updatedAt": "2026-05-20T12:40:00.000Z"
      }
    ]
  }
  ```

---

### `PATCH /api/guests/:id/approve` (Approve Guest)
Flat owner approves a pending guest request.

- **Authentication**: Required (`FLAT_OWNER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the guest request.
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Guest approved successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cf",
      "guard": "60d0fe4f5311236168a109cc",
      "flatOwner": "60d0fe4f5311236168a109cb",
      "guestName": "Alice Smith",
      "guestPhone": "+919898989898",
      "purpose": "Personal Visit",
      "vehicleNumber": "DL-1A-AA-9999",
      "photo": "https://example.com/uploads/alice.png",
      "status": "APPROVED",
      "createdAt": "2026-05-20T12:40:00.000Z",
      "updatedAt": "2026-05-20T12:42:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found` (If guest request not found or not belonging to logged-in flatOwner):
    ```json
    {
      "success": false,
      "message": "Guest request not found"
    }
    ```

---

### `PATCH /api/guests/:id/reject` (Reject Guest)
Flat owner rejects a pending guest request.

- **Authentication**: Required (`FLAT_OWNER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the guest request.
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Guest rejected successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cf",
      "guard": "60d0fe4f5311236168a109cc",
      "flatOwner": "60d0fe4f5311236168a109cb",
      "guestName": "Alice Smith",
      "guestPhone": "+919898989898",
      "purpose": "Personal Visit",
      "vehicleNumber": "DL-1A-AA-9999",
      "photo": "https://example.com/uploads/alice.png",
      "status": "REJECTED",
      "createdAt": "2026-05-20T12:40:00.000Z",
      "updatedAt": "2026-05-20T12:43:00.000Z"
    }
  }
  ```

---

### `PATCH /api/guests/:id/entry` (Mark Guest Entered)
Security guard logs that the pre-approved guest has physically entered the gate complex. Changes status to `ENTERED` and logs `entryTime`.

- **Authentication**: Required (`GUARD` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the guest request. Must be in `APPROVED` status.
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Guest entry marked successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cf",
      "guard": "60d0fe4f5311236168a109cc",
      "flatOwner": "60d0fe4f5311236168a109cb",
      "guestName": "Alice Smith",
      "guestPhone": "+919898989898",
      "purpose": "Personal Visit",
      "vehicleNumber": "DL-1A-AA-9999",
      "photo": "https://example.com/uploads/alice.png",
      "status": "ENTERED",
      "entryTime": "2026-05-20T12:45:00.000Z",
      "createdAt": "2026-05-20T12:40:00.000Z",
      "updatedAt": "2026-05-20T12:45:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found` (If guest is not found, not assigned to logged-in guard, or not in `APPROVED` status):
    ```json
    {
      "success": false,
      "message": "Approved guest not found"
    }
    ```

---

### `PATCH /api/guests/:id/exit` (Mark Guest Exited)
Security guard logs that the guest has physically left the gate complex. Changes status to `EXITED` and logs `exitTime`.

- **Authentication**: Required (`GUARD` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the guest request. Must be in `ENTERED` status.
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Guest exit marked successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cf",
      "guard": "60d0fe4f5311236168a109cc",
      "flatOwner": "60d0fe4f5311236168a109cb",
      "guestName": "Alice Smith",
      "guestPhone": "+919898989898",
      "purpose": "Personal Visit",
      "vehicleNumber": "DL-1A-AA-9999",
      "photo": "https://example.com/uploads/alice.png",
      "status": "EXITED",
      "entryTime": "2026-05-20T12:45:00.000Z",
      "exitTime": "2026-05-20T13:30:00.000Z",
      "createdAt": "2026-05-20T12:40:00.000Z",
      "updatedAt": "2026-05-20T13:30:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found` (If guest not found, not assigned to logged-in guard, or not in `ENTERED` status):
    ```json
    {
      "success": false,
      "message": "Entered guest not found"
    }
    ```

---

### `GET /api/guests/history` (Get All Guest History)
Fetches all visitor logs across the entire society, sorted by creation date descending. Populates guard and flat owner details.

- **Authentication**: Required (`SUPER_ADMIN` or `MANAGER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "60d0fe4f5311236168a109cf",
        "guard": {
          "_id": "60d0fe4f5311236168a109cc",
          "name": "Guard Duty",
          "phone": "+919900000001",
          "role": "GUARD"
        },
        "flatOwner": {
          "_id": "60d0fe4f5311236168a109cb",
          "name": "John Doe",
          "phone": "+919988776655",
          "role": "FLAT_OWNER"
        },
        "guestName": "Alice Smith",
        "guestPhone": "+919898989898",
        "purpose": "Personal Visit",
        "vehicleNumber": "DL-1A-AA-9999",
        "photo": "https://example.com/uploads/alice.png",
        "status": "EXITED",
        "entryTime": "2026-05-20T12:45:00.000Z",
        "exitTime": "2026-05-20T13:30:00.000Z",
        "createdAt": "2026-05-20T12:40:00.000Z",
        "updatedAt": "2026-05-20T13:30:00.000Z"
      }
    ]
  }
  ```

---

## 7. Daily Staff Management Endpoints

Endpoints for managing daily service providers (e.g. maids, drivers, cooks).

### `POST /api/daily-staff/` (Create Daily Staff)
Flat owner registers a new daily service provider.

- **Authentication**: Required (`FLAT_OWNER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
  - `Content-Type: application/json`
- **Request Body Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `staffName` | String | **Yes** | Full name of the staff member |
  | `staffPhone`| String | **Yes** | Phone number of the staff member |
  | `staffType` | String | **Yes** | One of `MAID`, `DRIVER`, `COOK`, `CLEANER`, `MILKMAN`, `NEWSPAPER`, `OTHER` |
  | `photo` | String | No | URL link or base64 format of the photo. Defaults to empty string |
  | `allowedDays`| Array (Strings) | No | Days allowed: elements must be from `["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]` |
  | `entryTime` | String | No | Custom standard entry window string (e.g., "08:00 AM") |
  | `exitTime` | String | No | Custom standard exit window string (e.g., "11:00 AM") |

- **Sample Request**:
  ```json
  {
    "staffName": "Jane Cleaner",
    "staffPhone": "+919876543220",
    "staffType": "CLEANER",
    "photo": "https://example.com/staff/jane.png",
    "allowedDays": ["MON", "WED", "FRI"],
    "entryTime": "09:00 AM",
    "exitTime": "11:00 AM"
  }
  ```

- **Successful Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Daily staff registered successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109d0",
      "flatOwner": "60d0fe4f5311236168a109cb",
      "staffName": "Jane Cleaner",
      "staffPhone": "+919876543220",
      "staffType": "CLEANER",
      "photo": "https://example.com/staff/jane.png",
      "isBlocked": false,
      "allowedDays": ["MON", "WED", "FRI"],
      "entryTime": "09:00 AM",
      "exitTime": "11:00 AM",
      "createdAt": "2026-05-20T12:50:00.000Z",
      "updatedAt": "2026-05-20T12:50:00.000Z"
    }
  }
  ```

---

### `GET /api/daily-staff/my-staff` (Get My Daily Staff)
Retrieves all daily staff registered by the currently logged-in Flat Owner, ordered by creation date descending.

- **Authentication**: Required (`FLAT_OWNER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "60d0fe4f5311236168a109d0",
        "flatOwner": "60d0fe4f5311236168a109cb",
        "staffName": "Jane Cleaner",
        "staffPhone": "+919876543220",
        "staffType": "CLEANER",
        "photo": "https://example.com/staff/jane.png",
        "isBlocked": false,
        "allowedDays": ["MON", "WED", "FRI"],
        "entryTime": "09:00 AM",
        "exitTime": "11:00 AM",
        "createdAt": "2026-05-20T12:50:00.000Z",
        "updatedAt": "2026-05-20T12:50:00.000Z"
      }
    ]
  }
  ```

---

### `GET /api/daily-staff/` (Get All Daily Staff)
Retrieves a list of all daily staff registered across the system, with populated flatOwner details.

- **Authentication**: Required (`SUPER_ADMIN` or `MANAGER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "60d0fe4f5311236168a109d0",
        "flatOwner": {
          "_id": "60d0fe4f5311236168a109cb",
          "name": "John Doe",
          "phone": "+919988776655",
          "role": "FLAT_OWNER"
        },
        "staffName": "Jane Cleaner",
        "staffPhone": "+919876543220",
        "staffType": "CLEANER",
        "photo": "https://example.com/staff/jane.png",
        "isBlocked": false,
        "allowedDays": ["MON", "WED", "FRI"],
        "entryTime": "09:00 AM",
        "exitTime": "11:00 AM",
        "createdAt": "2026-05-20T12:50:00.000Z",
        "updatedAt": "2026-05-20T12:50:00.000Z"
      }
    ]
  }
  ```

---

### `PATCH /api/daily-staff/:id/block` (Block Daily Staff)
Blocks a daily staff member from entry permissions. Only the registering Flat Owner can invoke this block status.

- **Authentication**: Required (`FLAT_OWNER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the daily staff.
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Daily staff blocked successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109d0",
      "flatOwner": "60d0fe4f5311236168a109cb",
      "staffName": "Jane Cleaner",
      "staffPhone": "+919876543220",
      "staffType": "CLEANER",
      "photo": "https://example.com/staff/jane.png",
      "isBlocked": true,
      "allowedDays": ["MON", "WED", "FRI"],
      "entryTime": "09:00 AM",
      "exitTime": "11:00 AM",
      "createdAt": "2026-05-20T12:50:00.000Z",
      "updatedAt": "2026-05-20T13:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found` (If staff not found or not belonging to logged-in flatOwner):
    ```json
    {
      "success": false,
      "message": "Daily staff not found"
    }
    ```

---

### `PATCH /api/daily-staff/:id/unblock` (Unblock Daily Staff)
Unblocks a daily staff member from entry permissions. Only the registering Flat Owner can invoke this.

- **Authentication**: Required (`FLAT_OWNER` only)
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the daily staff.
- **Request Body**: *None*
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Daily staff unblocked successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109d0",
      "flatOwner": "60d0fe4f5311236168a109cb",
      "staffName": "Jane Cleaner",
      "staffPhone": "+919876543220",
      "staffType": "CLEANER",
      "photo": "https://example.com/staff/jane.png",
      "isBlocked": false,
      "allowedDays": ["MON", "WED", "FRI"],
      "entryTime": "09:00 AM",
      "exitTime": "11:00 AM",
      "createdAt": "2026-05-20T12:50:00.000Z",
      "updatedAt": "2026-05-20T13:05:00.000Z"
    }
  }
  ```
