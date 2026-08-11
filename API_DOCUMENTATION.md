# 📘 Cake Delight — API Documentation

Complete REST API reference for all microservices in the Cake Delight application.

**Base URL (via API Gateway):** `http://<host>:5000` (local) or `http://<host>:30500` (K8s NodePort)

---

## Table of Contents

1. [API Gateway](#1-api-gateway)
2. [Cake Catalog Service](#2-cake-catalog-service-port-3001)
3. [Order Service — Basket](#3-order-service--basket-port-3002)
4. [Order Service — Checkout & Orders](#4-order-service--checkout--orders-port-3002)
5. [Rating Service](#5-rating-service-port-3003)
6. [Notification Service](#6-notification-service-port-3004)
7. [RabbitMQ Event Contract](#7-rabbitmq-event-contract)

---

## 1. API Gateway

The API Gateway is the **single entry point** for all client requests. It reverse-proxies requests to the appropriate backend microservice using `http-proxy-middleware`.

| Route Pattern | Target Service | Port |
|:---|:---|:---|
| `/api/cakes/**` | Catalog Service | 3001 |
| `/api/basket/**` | Order Service | 3002 |
| `/api/checkout` | Order Service | 3002 |
| `/api/orders/**` | Order Service | 3002 |
| `/api/ratings/**` | Rating Service | 3003 |
| `/api/notifications/**` | Notification Service | 3004 |

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "UP",
  "service": "api-gateway",
  "timestamp": "2026-08-11T06:00:00.000Z"
}
```

---

## 2. Cake Catalog Service (Port 3001)

Manages the cake product catalog with full CRUD operations and filtering.

### 2.1 List All Cakes (with Filters)

```
GET /api/cakes
```

**Query Parameters (all optional):**

| Parameter | Type | Description | Example |
|:---|:---|:---|:---|
| `name` | string | Filter by cake name (case-insensitive, partial match) | `?name=chocolate` |
| `category` | string | Filter by category (case-insensitive, partial match) | `?category=Velvet` |
| `minPrice` | number | Minimum price filter | `?minPrice=20` |
| `maxPrice` | number | Maximum price filter | `?maxPrice=30` |

**Example Request:**
```
GET /api/cakes?category=Chocolate&minPrice=20&maxPrice=30
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6a76fbd76c295ef020200f5f",
      "name": "Chocolate Truffle Delight",
      "description": "Rich dark chocolate layer cake topped with ganache glaze",
      "category": "Chocolate",
      "price": 24.99,
      "stockQuantity": 15,
      "imageUrl": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
      "createdAt": "2026-08-11T06:00:00.000Z"
    }
  ]
}
```

### 2.2 Get Cake by ID

```
GET /api/cakes/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6a76fbd76c295ef020200f5f",
    "name": "Chocolate Truffle Delight",
    "description": "Rich dark chocolate layer cake topped with ganache glaze",
    "category": "Chocolate",
    "price": 24.99,
    "stockQuantity": 15,
    "imageUrl": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    "createdAt": "2026-08-11T06:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Cake not found"
}
```

### 2.3 Create New Cake

```
POST /api/cakes
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Blueberry Cheesecake",
  "description": "Creamy cheesecake with fresh blueberry compote",
  "category": "Fruit",
  "price": 32.00,
  "stockQuantity": 10,
  "imageUrl": "https://images.unsplash.com/photo-example"
}
```

**Required Fields:** `name`, `description`, `category`, `price`, `imageUrl`

**Success Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

### 2.4 Update Cake

```
PUT /api/cakes/:id
Content-Type: application/json
```

**Request Body (partial updates supported):**
```json
{
  "price": 35.00,
  "stockQuantity": 20
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

### 2.5 Delete Cake

```
DELETE /api/cakes/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cake deleted successfully"
}
```

---

## 3. Order Service — Basket (Port 3002)

Manages customer shopping baskets with add, view, update, and remove operations.

### 3.1 Get Basket

```
GET /api/basket/:customerId
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "customerId": "cust_1723348800000",
    "items": [
      {
        "cakeId": "6a76fbd76c295ef020200f5f",
        "name": "Chocolate Truffle Delight",
        "price": 24.99,
        "quantity": 2
      }
    ],
    "totalAmount": 49.98,
    "updatedAt": "2026-08-11T06:00:00.000Z"
  }
}
```

### 3.2 Add Item to Basket

```
POST /api/basket/items
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerId": "cust_1723348800000",
  "cakeId": "6a76fbd76c295ef020200f5f",
  "name": "Chocolate Truffle Delight",
  "price": 24.99,
  "quantity": 1
}
```

**Required Fields:** `customerId`, `cakeId`, `name`, `price`

**Behavior:** If the item already exists in the basket, the quantity is incremented.

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

### 3.3 Update Item Quantity

```
PUT /api/basket/items
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerId": "cust_1723348800000",
  "cakeId": "6a76fbd76c295ef020200f5f",
  "quantity": 3
}
```

**Required Fields:** `customerId`, `cakeId`, `quantity` (must be ≥ 1)

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

### 3.4 Remove Item from Basket

```
DELETE /api/basket/items/:customerId/:cakeId
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 4. Order Service — Checkout & Orders (Port 3002)

Handles order creation during checkout and publishes order completion events to RabbitMQ.

### 4.1 Process Checkout

```
POST /api/checkout
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerId": "cust_1723348800000",
  "customerName": "Murugan",
  "customerEmail": "murugan@example.com"
}
```

**Required Fields:** `customerId`, `customerName`, `customerEmail`

**Behavior:**
1. Retrieves the customer's basket
2. Creates an order with all basket items
3. Clears the basket
4. Publishes `OrderCompleted` event to RabbitMQ

**Success Response (201):**
```json
{
  "success": true,
  "message": "Checkout successful! Order created and notification event published.",
  "data": {
    "_id": "668f1234abcd5678ef901234",
    "customerName": "Murugan",
    "customerEmail": "murugan@example.com",
    "items": [ ... ],
    "totalAmount": 49.98,
    "status": "COMPLETED",
    "createdAt": "2026-08-11T06:00:00.000Z"
  }
}
```

**Error Response (400 — Empty Basket):**
```json
{
  "success": false,
  "message": "Shopping basket is empty. Cannot checkout."
}
```

### 4.2 Get Order by ID

```
GET /api/orders/:orderId
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "668f1234abcd5678ef901234",
    "customerName": "Murugan",
    "customerEmail": "murugan@example.com",
    "items": [ ... ],
    "totalAmount": 49.98,
    "status": "COMPLETED",
    "createdAt": "2026-08-11T06:00:00.000Z"
  }
}
```

---

## 5. Rating Service (Port 3003)

Manages product ratings and reviews with aggregate calculations.

### 5.1 Submit Rating

```
POST /api/ratings
Content-Type: application/json
```

**Request Body:**
```json
{
  "cakeId": "6a76fbd76c295ef020200f5f",
  "customerName": "Alice Smith",
  "ratingScore": 5,
  "comment": "Absolutely delicious! Rich chocolate flavor."
}
```

**Required Fields:** `cakeId`, `customerName`, `ratingScore` (1-5)

**Validation:** `ratingScore` must be between 1 and 5.

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "cakeId": "6a76fbd76c295ef020200f5f",
    "customerName": "Alice Smith",
    "ratingScore": 5,
    "comment": "Absolutely delicious! Rich chocolate flavor.",
    "createdAt": "2026-08-11T06:00:00.000Z"
  }
}
```

### 5.2 Get All Ratings for a Cake

```
GET /api/ratings/cake/:cakeId
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "cakeId": "6a76fbd76c295ef020200f5f",
      "customerName": "Alice Smith",
      "ratingScore": 5,
      "comment": "Absolutely delicious!",
      "createdAt": "2026-08-11T06:00:00.000Z"
    }
  ]
}
```

### 5.3 Get Rating Summary (Average + Count)

```
GET /api/ratings/cake/:cakeId/summary
```

**Success Response (200):**
```json
{
  "success": true,
  "cakeId": "6a76fbd76c295ef020200f5f",
  "averageRating": 4.5,
  "totalReviews": 2
}
```

**Response when no ratings exist:**
```json
{
  "success": true,
  "cakeId": "6a76fbd76c295ef020200f5f",
  "averageRating": 0,
  "totalReviews": 0
}
```

---

## 6. Notification Service (Port 3004)

Listens for order completion events via RabbitMQ and sends email notifications.

### 6.1 Get All Notifications

```
GET /api/notifications
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "orderId": "668f1234abcd5678ef901234",
      "customerName": "Murugan",
      "customerEmail": "murugan@example.com",
      "totalAmount": 49.98,
      "channel": "EMAIL",
      "status": "SENT",
      "message": "Order confirmation notification sent to murugan@example.com for Order #668f1234 (Total: ₹499.00)",
      "sentAt": "2026-08-11T06:00:00.000Z"
    }
  ]
}
```

### 6.2 Get Notification by Order ID

```
GET /api/notifications/order/:orderId
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Notification log not found for order"
}
```

---

## 7. RabbitMQ Event Contract

### Event: `OrderCompleted`

| Property | Type | Description |
|:---|:---|:---|
| Exchange | `cake_events` | Topic exchange (durable) |
| Routing Key | `order.completed` | — |
| Queue | `notification_queue` | Bound in Notification Service |

**Event Payload:**
```json
{
  "event": "OrderCompleted",
  "orderId": "668f1234abcd5678ef901234",
  "customerName": "Murugan",
  "customerEmail": "murugan@example.com",
  "totalAmount": 49.98,
  "items": [
    {
      "cakeId": "6a76fbd76c295ef020200f5f",
      "name": "Chocolate Truffle Delight",
      "price": 24.99,
      "quantity": 2
    }
  ],
  "timestamp": "2026-08-11T06:00:00.000Z"
}
```

**Flow:**
1. **Order Service** publishes `OrderCompleted` event to `cake_events` exchange with routing key `order.completed`
2. **Notification Service** consumes from `notification_queue` (bound to `cake_events` with key `order.completed`)
3. Notification Service sends confirmation email via Nodemailer (Ethereal test / custom SMTP)
4. Notification delivery log is persisted to MongoDB with status `SENT`

---

## Error Response Format

All services follow a consistent error response format:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": "Technical error details (only in 500 errors)"
}
```

| HTTP Status | Meaning |
|:---|:---|
| 200 | Success |
| 201 | Created (POST operations) |
| 400 | Bad Request (validation error / missing fields) |
| 404 | Resource not found |
| 500 | Internal Server Error |
