# User Interactions & Examples Plan

## Document Purpose
This document details:
1. **User workflows** - How users interact with the platform
2. **Example contracts** - Sample OpenAPI and AsyncAPI specifications
3. **UI/UX patterns** - Mockups and interaction flows
4. **User scenarios** - Real-world use cases

---

## Table of Contents
1. [User Personas](#user-personas)
2. [Core User Workflows](#core-user-workflows)
3. [Example API Contracts](#example-api-contracts)
4. [UI/UX Interaction Patterns](#uiux-interaction-patterns)
5. [User Scenarios](#user-scenarios)
6. [Navigation Patterns](#navigation-patterns)

---

## User Personas

### Persona 1: The API Consumer (Developer)
**Background**: Frontend or backend developer who needs to integrate with APIs
**Goals**:
- Quickly understand what operations are available
- Find the right operation for their use case
- Get working code examples
- Understand data schemas

**Pain Points**:
- Overwhelmed by protocol-specific terminology
- Switching between different documentation tools for REST vs event-driven
- Hard to find specific operations in large APIs

**Platform Needs**:
- Simple, intuitive search
- Clear operation descriptions
- Copy-paste code examples
- Visual schema representation

---

### Persona 2: The API Designer (Architect)
**Background**: Technical lead designing system architecture with mixed protocols
**Goals**:
- Document both REST and event-driven APIs in one place
- Ensure consistency across different API types
- Share documentation with team and stakeholders
- Validate API contracts

**Pain Points**:
- Managing multiple documentation tools
- Inconsistent presentation between REST and AsyncAPI
- Hard to get overview of entire system

**Platform Needs**:
- Unified view of all operations
- Easy deployment and sharing
- Clear visual distinction between sync/async patterns
- Support for multiple specs in one site

---

### Persona 3: The Non-Technical Stakeholder (Product Manager)
**Background**: Product manager or business analyst reviewing API capabilities
**Goals**:
- Understand what the API can do
- Review operation descriptions and use cases
- No need for technical implementation details

**Pain Points**:
- Technical jargon is confusing
- Can't navigate REST vs Kafka documentation
- Needs high-level overview, not implementation

**Platform Needs**:
- Protocol-agnostic terminology
- Clear, business-focused descriptions
- Ability to hide technical details
- Visual, scannable interface

---

## Core User Workflows

### Workflow 1: Adding Documentation (First Time)

**Steps:**
1. User has OpenAPI and AsyncAPI spec files
2. User clones/downloads the platform repository
3. User runs `npm install`
4. User copies their OpenAPI spec to `src/specs/openapi/my-api.yaml`
5. User copies their AsyncAPI spec to `src/specs/asyncapi/my-events.yaml`
6. User runs `npm run dev`
7. Platform auto-detects both specs
8. Platform parses and normalizes to unified model
9. User navigates to `http://localhost:3000`
10. User sees all operations from both specs in unified interface

**Expected Time**: < 5 minutes

**User Actions**:
- Copy files to correct folders
- Run single command

**Platform Actions**:
- Auto-detect spec types
- Validate specs
- Parse and normalize
- Generate unified documentation
- Serve locally

---

### Workflow 2: Browsing Operations (Discovery)

**User arrives at documentation site**

**Step 1: Landing Page**
- User sees overview of all available contracts
- Displays: Contract names, descriptions, protocol badges (subtle)
- User selects a contract or views "All Operations"

**Step 2: Operations List**
- User sees list of all operations (unified view)
- Each card shows:
  - Action type (GET, POST, Publish, Subscribe) with color coding
  - Location (URL path or channel name)
  - Brief description
  - Tags/categories
- User can filter by:
  - Tags/categories
  - Search term
  - (Optional) Communication pattern (sync/async)
  - (Optional) Protocol type

**Step 3: Search**
- User types search term (e.g., "user", "payment", "order")
- Platform searches across:
  - Operation names
  - Descriptions
  - Tags
  - Data schema properties
- Results show unified cards regardless of protocol

**Step 4: Select Operation**
- User clicks on operation card
- Platform navigates to detailed view

---

### Workflow 3: Understanding an Operation (Details)

**User is viewing an operation detail page**

**Section 1: Overview**
- **Action Type**: GET / POST / Publish / Subscribe (prominent badge)
- **Location**: `/api/users/{id}` or `user.events.created`
- **Description**: Clear, business-focused explanation
- **Communication Pattern**: Request/Response or Publish/Subscribe
- **Protocol Badge**: Small, subtle indicator (REST/Kafka)

**Section 2: Input Data**
- **Label**: "Input Data" (universal term)
  - For REST: Shows request body schema
  - For AsyncAPI: Shows message payload schema
- **Schema Display**:
  - Properties table with types, descriptions, constraints
  - Example JSON
  - Copy button

**Section 3: Output Data**
- **Label**: "Output Data" (universal term)
  - For REST: Shows response schema(s) with status codes
  - For AsyncAPI: Shows subscribed message schema
- **Schema Display**: Same as input

**Section 4: Parameters**
- **Label**: "Parameters" (universal term)
  - For REST: Path params, query params, headers
  - For AsyncAPI: Message headers, channel parameters
- **Display**: Table with name, type, required, description

**Section 5: Code Examples**
- **Tabs**: JavaScript, Python, cURL, etc.
- **Adaptive**:
  - REST → HTTP client code
  - Kafka → Producer/Consumer code
- **Copy button**: One-click copy to clipboard

**Section 6: Additional Details** (Collapsible)
- Authentication/security requirements
- Servers/endpoints
- Protocol-specific bindings (for advanced users)

---

### Workflow 4: Copying Code Examples

**User wants to integrate an operation**

**Steps:**
1. User navigates to operation detail
2. User scrolls to "Code Examples" section
3. User selects preferred language tab (JavaScript, Python, etc.)
4. Platform shows code adapted to operation type:
   - REST: `fetch()` or `axios` request
   - Kafka: Kafka producer or consumer setup
5. User clicks "Copy" button
6. Code copied to clipboard
7. User pastes into their project
8. Code works with minimal modification

**Key Requirement**: Examples must be production-ready, not just syntactically correct

---

### Workflow 5: Deploying Documentation

**User wants to share documentation publicly**

**Steps:**
1. User updates specs in `src/specs/`
2. User commits changes to git
3. User pushes to GitHub
4. GitHub Actions triggers build
5. Platform generates static site
6. Deploys to Vercel/Netlify automatically
7. Documentation live at public URL
8. Team/stakeholders can access

**Expected Time**: < 2 minutes (after initial setup)

---

## Example API Contracts

### Example 1: E-commerce REST API (OpenAPI)

**Filename**: `src/specs/openapi/ecommerce-api.yaml`

```yaml
openapi: 3.0.0
info:
  title: E-commerce API
  version: 1.0.0
  description: REST API for managing products, orders, and users

servers:
  - url: https://api.example.com/v1
    description: Production server

tags:
  - name: Products
    description: Product catalog operations
  - name: Orders
    description: Order management
  - name: Users
    description: User account operations

paths:
  /products:
    get:
      summary: List all products
      description: Retrieve a paginated list of all products in the catalog
      operationId: listProducts
      tags:
        - Products
      parameters:
        - name: page
          in: query
          description: Page number for pagination
          required: false
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          description: Number of items per page
          required: false
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  products:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  pagination:
                    $ref: '#/components/schemas/Pagination'

  /products/{productId}:
    get:
      summary: Get product details
      description: Retrieve detailed information about a specific product
      operationId: getProduct
      tags:
        - Products
      parameters:
        - name: productId
          in: path
          description: Unique product identifier
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Product found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Product not found

  /orders:
    post:
      summary: Create new order
      description: Place a new order for products
      operationId: createOrder
      tags:
        - Orders
      requestBody:
        description: Order details
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequest'
            example:
              userId: "user-123"
              items:
                - productId: "prod-456"
                  quantity: 2
                - productId: "prod-789"
                  quantity: 1
              shippingAddress:
                street: "123 Main St"
                city: "San Francisco"
                state: "CA"
                zipCode: "94102"
      responses:
        '201':
          description: Order created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Invalid order data

  /users/{userId}/orders:
    get:
      summary: Get user's orders
      description: Retrieve all orders for a specific user
      operationId: getUserOrders
      tags:
        - Orders
        - Users
      parameters:
        - name: userId
          in: path
          description: User identifier
          required: true
          schema:
            type: string
      responses:
        '200':
          description: List of user orders
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Order'

components:
  schemas:
    Product:
      type: object
      required:
        - id
        - name
        - price
      properties:
        id:
          type: string
          format: uuid
          description: Unique product identifier
        name:
          type: string
          description: Product name
          example: "Wireless Headphones"
        description:
          type: string
          description: Detailed product description
        price:
          type: number
          format: float
          description: Product price in USD
          example: 79.99
        category:
          type: string
          description: Product category
          example: "Electronics"
        inStock:
          type: boolean
          description: Whether product is currently in stock
          default: true
        imageUrl:
          type: string
          format: uri
          description: URL to product image

    Order:
      type: object
      required:
        - id
        - userId
        - items
        - status
        - createdAt
      properties:
        id:
          type: string
          format: uuid
          description: Unique order identifier
        userId:
          type: string
          description: ID of user who placed the order
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
        totalAmount:
          type: number
          format: float
          description: Total order amount in USD
        status:
          type: string
          enum:
            - pending
            - confirmed
            - shipped
            - delivered
            - cancelled
          description: Current order status
        shippingAddress:
          $ref: '#/components/schemas/Address'
        createdAt:
          type: string
          format: date-time
          description: Order creation timestamp
        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp

    OrderItem:
      type: object
      required:
        - productId
        - quantity
        - price
      properties:
        productId:
          type: string
          description: Product identifier
        productName:
          type: string
          description: Product name at time of order
        quantity:
          type: integer
          minimum: 1
          description: Quantity ordered
        price:
          type: number
          format: float
          description: Price per unit at time of order

    CreateOrderRequest:
      type: object
      required:
        - userId
        - items
        - shippingAddress
      properties:
        userId:
          type: string
          description: User placing the order
        items:
          type: array
          minItems: 1
          items:
            type: object
            required:
              - productId
              - quantity
            properties:
              productId:
                type: string
              quantity:
                type: integer
                minimum: 1
        shippingAddress:
          $ref: '#/components/schemas/Address'

    Address:
      type: object
      required:
        - street
        - city
        - state
        - zipCode
      properties:
        street:
          type: string
          example: "123 Main St"
        city:
          type: string
          example: "San Francisco"
        state:
          type: string
          example: "CA"
        zipCode:
          type: string
          example: "94102"
        country:
          type: string
          default: "USA"

    Pagination:
      type: object
      properties:
        currentPage:
          type: integer
        totalPages:
          type: integer
        totalItems:
          type: integer
        itemsPerPage:
          type: integer
```

---

### Example 2: E-commerce Events (AsyncAPI - Kafka)

**Filename**: `src/specs/asyncapi/ecommerce-events.yaml`

```yaml
asyncapi: 3.0.0
info:
  title: E-commerce Event Stream
  version: 1.0.0
  description: Event-driven architecture for e-commerce order processing and notifications

servers:
  production:
    host: kafka.example.com:9092
    protocol: kafka
    description: Production Kafka cluster

channels:
  orderCreated:
    address: ecommerce.orders.created
    messages:
      OrderCreatedEvent:
        $ref: '#/components/messages/OrderCreatedEvent'
    description: Published when a new order is created in the system
    bindings:
      kafka:
        topic: ecommerce.orders.created
        partitions: 10
        replicas: 3
        configs:
          retention.ms: 604800000  # 7 days

  orderStatusChanged:
    address: ecommerce.orders.status-changed
    messages:
      OrderStatusChangedEvent:
        $ref: '#/components/messages/OrderStatusChangedEvent'
    description: Published when order status changes (confirmed, shipped, delivered)
    bindings:
      kafka:
        topic: ecommerce.orders.status-changed
        partitions: 10
        replicas: 3

  inventoryUpdated:
    address: ecommerce.inventory.updated
    messages:
      InventoryUpdatedEvent:
        $ref: '#/components/messages/InventoryUpdatedEvent'
    description: Published when product inventory levels change
    bindings:
      kafka:
        topic: ecommerce.inventory.updated
        partitions: 5
        replicas: 3

  userNotification:
    address: ecommerce.notifications.user
    messages:
      UserNotificationEvent:
        $ref: '#/components/messages/UserNotificationEvent'
    description: Published to send notifications to users (email, SMS, push)
    bindings:
      kafka:
        topic: ecommerce.notifications.user
        partitions: 20
        replicas: 3

operations:
  publishOrderCreated:
    action: send
    channel:
      $ref: '#/channels/orderCreated'
    summary: Publish order created event
    description: When a new order is placed, this event is published to notify downstream services
    messages:
      - $ref: '#/channels/orderCreated/messages/OrderCreatedEvent'

  subscribeOrderCreated:
    action: receive
    channel:
      $ref: '#/channels/orderCreated'
    summary: Subscribe to order created events
    description: Services can subscribe to this to react to new orders (inventory, fulfillment, notifications)
    messages:
      - $ref: '#/channels/orderCreated/messages/OrderCreatedEvent'

  publishOrderStatusChanged:
    action: send
    channel:
      $ref: '#/channels/orderStatusChanged'
    summary: Publish order status change event
    description: Published when order moves through lifecycle stages

  subscribeOrderStatusChanged:
    action: receive
    channel:
      $ref: '#/channels/orderStatusChanged'
    summary: Subscribe to order status changes
    description: Subscribe to track order progress and trigger notifications

  publishInventoryUpdated:
    action: send
    channel:
      $ref: '#/channels/inventoryUpdated'
    summary: Publish inventory update event
    description: Published when product stock levels change

  subscribeInventoryUpdated:
    action: receive
    channel:
      $ref: '#/channels/inventoryUpdated'
    summary: Subscribe to inventory updates
    description: Subscribe to maintain real-time inventory visibility

components:
  messages:
    OrderCreatedEvent:
      name: OrderCreatedEvent
      title: Order Created
      summary: Event published when a new order is created
      contentType: application/json
      payload:
        $ref: '#/components/schemas/OrderCreatedPayload'
      examples:
        - name: Standard order
          payload:
            orderId: "order-abc-123"
            userId: "user-456"
            items:
              - productId: "prod-789"
                productName: "Wireless Headphones"
                quantity: 2
                unitPrice: 79.99
            totalAmount: 159.98
            currency: "USD"
            shippingAddress:
              street: "123 Main St"
              city: "San Francisco"
              state: "CA"
              zipCode: "94102"
            createdAt: "2025-11-08T10:30:00Z"
            metadata:
              source: "web"
              userAgent: "Mozilla/5.0..."

    OrderStatusChangedEvent:
      name: OrderStatusChangedEvent
      title: Order Status Changed
      summary: Event published when order status changes
      contentType: application/json
      payload:
        $ref: '#/components/schemas/OrderStatusChangedPayload'
      examples:
        - name: Order shipped
          payload:
            orderId: "order-abc-123"
            userId: "user-456"
            previousStatus: "confirmed"
            newStatus: "shipped"
            changedAt: "2025-11-09T14:20:00Z"
            trackingNumber: "TRK-123456789"
            carrier: "USPS"

    InventoryUpdatedEvent:
      name: InventoryUpdatedEvent
      title: Inventory Updated
      summary: Event published when product inventory changes
      contentType: application/json
      payload:
        $ref: '#/components/schemas/InventoryUpdatedPayload'

    UserNotificationEvent:
      name: UserNotificationEvent
      title: User Notification
      summary: Event for sending notifications to users
      contentType: application/json
      payload:
        $ref: '#/components/schemas/UserNotificationPayload'

  schemas:
    OrderCreatedPayload:
      type: object
      required:
        - orderId
        - userId
        - items
        - totalAmount
        - createdAt
      properties:
        orderId:
          type: string
          description: Unique order identifier
        userId:
          type: string
          description: User who placed the order
        items:
          type: array
          description: List of ordered items
          items:
            type: object
            required:
              - productId
              - quantity
              - unitPrice
            properties:
              productId:
                type: string
                description: Product identifier
              productName:
                type: string
                description: Product name at time of order
              quantity:
                type: integer
                minimum: 1
                description: Quantity ordered
              unitPrice:
                type: number
                format: float
                description: Price per unit
        totalAmount:
          type: number
          format: float
          description: Total order amount
        currency:
          type: string
          default: "USD"
          description: Currency code
        shippingAddress:
          type: object
          required:
            - street
            - city
            - state
            - zipCode
          properties:
            street:
              type: string
            city:
              type: string
            state:
              type: string
            zipCode:
              type: string
        createdAt:
          type: string
          format: date-time
          description: Order creation timestamp
        metadata:
          type: object
          description: Additional metadata
          properties:
            source:
              type: string
              enum: [web, mobile, api]
            userAgent:
              type: string

    OrderStatusChangedPayload:
      type: object
      required:
        - orderId
        - userId
        - previousStatus
        - newStatus
        - changedAt
      properties:
        orderId:
          type: string
          description: Order identifier
        userId:
          type: string
          description: User identifier
        previousStatus:
          type: string
          enum: [pending, confirmed, shipped, delivered, cancelled]
          description: Previous order status
        newStatus:
          type: string
          enum: [pending, confirmed, shipped, delivered, cancelled]
          description: New order status
        changedAt:
          type: string
          format: date-time
          description: Timestamp of status change
        trackingNumber:
          type: string
          description: Shipping tracking number (if status is shipped)
        carrier:
          type: string
          description: Shipping carrier (if status is shipped)
        reason:
          type: string
          description: Reason for status change (especially for cancelled)

    InventoryUpdatedPayload:
      type: object
      required:
        - productId
        - previousQuantity
        - newQuantity
        - updatedAt
      properties:
        productId:
          type: string
          description: Product identifier
        productName:
          type: string
          description: Product name
        previousQuantity:
          type: integer
          description: Quantity before update
        newQuantity:
          type: integer
          description: Quantity after update
        change:
          type: integer
          description: Change in quantity (positive or negative)
        reason:
          type: string
          enum: [sale, restock, return, adjustment]
          description: Reason for inventory change
        updatedAt:
          type: string
          format: date-time
          description: Update timestamp

    UserNotificationPayload:
      type: object
      required:
        - userId
        - notificationType
        - channel
        - message
      properties:
        userId:
          type: string
          description: Target user identifier
        notificationType:
          type: string
          enum: [order_confirmation, order_shipped, order_delivered, promotion, account]
          description: Type of notification
        channel:
          type: string
          enum: [email, sms, push]
          description: Notification delivery channel
        message:
          type: object
          required:
            - subject
            - body
          properties:
            subject:
              type: string
              description: Notification subject/title
            body:
              type: string
              description: Notification body content
            actionUrl:
              type: string
              format: uri
              description: URL for user action (e.g., track order)
        metadata:
          type: object
          description: Additional notification metadata
```

---

## UI/UX Interaction Patterns

### Pattern 1: Unified Operation Card

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [ACTION BADGE]  Location/Path                          │
│                                                         │
│ Brief description of what this operation does...       │
│                                                         │
│ Tags: [Tag1] [Tag2]    [Protocol Badge: REST]         │
└─────────────────────────────────────────────────────────┘
```

**Examples:**

**REST Endpoint:**
```
┌─────────────────────────────────────────────────────────┐
│ [POST]  /api/orders                                     │
│                                                         │
│ Create a new order for products                        │
│                                                         │
│ Tags: [Orders]         [🔷 REST]                       │
└─────────────────────────────────────────────────────────┘
```

**Kafka Publish:**
```
┌─────────────────────────────────────────────────────────┐
│ [PUBLISH]  ecommerce.orders.created                     │
│                                                         │
│ Publish order created event to notify downstream       │
│                                                         │
│ Tags: [Orders]         [🟣 Kafka]                      │
└─────────────────────────────────────────────────────────┘
```

**Note**: Both cards use identical layout - users can't tell which is REST vs Kafka without looking at the badge.

---

### Pattern 2: Operation Detail Layout

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Operations                                        │
│                                                              │
│  [ACTION BADGE]  Location                   [Protocol Badge]│
│                                                              │
│  Description of the operation...                            │
│                                                              │
│  Communication: Request → Response  (or Publish/Subscribe)  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  📥 INPUT DATA                                      [Expand] │
│  ├─ Schema                                                   │
│  │  └─ [Interactive schema tree view]                       │
│  └─ Example                                                  │
│     └─ [JSON example with copy button]                      │
├──────────────────────────────────────────────────────────────┤
│  📤 OUTPUT DATA                                     [Expand] │
│  ├─ Schema                                                   │
│  │  └─ [Interactive schema tree view]                       │
│  └─ Example                                                  │
│     └─ [JSON example with copy button]                      │
├──────────────────────────────────────────────────────────────┤
│  ⚙️ PARAMETERS                                      [Expand] │
│  └─ [Table of parameters]                                   │
├──────────────────────────────────────────────────────────────┤
│  💻 CODE EXAMPLES                                   [Expand] │
│  ├─ [JavaScript] [Python] [cURL] [Java]                     │
│  └─ [Code snippet with copy button]                         │
├──────────────────────────────────────────────────────────────┤
│  🔐 SECURITY                                        [Expand] │
│  └─ [Security requirements]                                 │
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Identical layout for REST and Kafka operations
- Universal terminology (Input/Output, not Request/Response)
- Protocol badge subtle but visible
- Collapsible sections for progressive disclosure

---

### Pattern 3: Search Interaction

**Search Bar State Diagram:**

```
[Empty State]
┌────────────────────────────────┐
│ 🔍 Search operations...        │
└────────────────────────────────┘

↓ (User types "order")

[Active Search with Results]
┌────────────────────────────────┐
│ 🔍 order                    [×]│
└────────────────────────────────┘
Results: 6 operations found

┌─────────────────────────────────────┐
│ [POST] /api/orders                  │
│ Create a new order...               │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [GET] /api/users/{id}/orders        │
│ Get user's orders...                │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [PUBLISH] ecommerce.orders.created  │
│ Publish order created event...      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [SUBSCRIBE] ecommerce.orders.cre... │
│ Subscribe to order events...        │
└─────────────────────────────────────┘
```

**Search Logic:**
- Searches across operation names, descriptions, tags
- No protocol filter by default (truly unified)
- Results ranked by relevance
- Both REST and Kafka results intermixed

---

### Pattern 4: Navigation Sidebar

```
┌────────────────────────┐
│ E-commerce API Docs    │
├────────────────────────┤
│ 🔍 Search...           │
├────────────────────────┤
│ 📋 All Operations (15) │
├────────────────────────┤
│ 📂 By Category         │
│  ├─ 🛍️  Products (4)   │
│  ├─ 📦 Orders (6)      │
│  ├─ 👤 Users (3)       │
│  └─ 🔔 Notifications(2)│
├────────────────────────┤
│ 🔀 By Pattern          │
│  ├─ Sync (9)           │
│  └─ Async (6)          │
├────────────────────────┤
│ ⚙️ Filters             │
│  ☐ REST                │
│  ☐ Kafka               │
└────────────────────────┘
```

**Key Features:**
- Categories mix REST and Kafka operations
- Protocol filter is optional, not default
- Communication pattern (sync/async) available but not emphasized
- Count shows total operations

---

## User Scenarios

### Scenario 1: New Developer Joins Team

**Context**: Sarah is a new frontend developer who needs to integrate the e-commerce API

**Scenario Steps:**

1. **Discovery**: Sarah receives link to documentation site
2. **Landing**: Arrives at homepage, sees "E-commerce API Documentation"
3. **Search**: Types "create order" in search
4. **Results**: Sees two operations:
   - `POST /api/orders` - Create a new order
   - `PUBLISH ecommerce.orders.created` - Publish order created event
5. **Selection**: Clicks on `POST /api/orders` (needs synchronous response)
6. **Understanding**:
   - Sees it's a "Request → Response" operation
   - Views input schema (order details required)
   - Views output schema (order confirmation)
7. **Implementation**:
   - Switches to "JavaScript" tab in code examples
   - Copies fetch() code
   - Pastes into her React app
   - Works immediately

**Outcome**: Sarah integrated the API in 10 minutes without asking questions

**Platform Success**:
- ✅ Search found both sync and async options
- ✅ Clear distinction between request/response and publish
- ✅ Code example was ready to use

---

### Scenario 2: Architect Reviews System Design

**Context**: Mike is reviewing the complete e-commerce system architecture (REST + Events)

**Scenario Steps:**

1. **Overview**: Opens documentation to understand all operations
2. **Browsing**: Clicks "All Operations" to see complete list
3. **Analysis**: Sees operations grouped by category:
   - **Orders Category**: Contains both REST endpoints AND Kafka events
   - `POST /api/orders` (sync)
   - `PUBLISH ecommerce.orders.created` (async)
   - `SUBSCRIBE ecommerce.orders.created` (async)
   - `PUBLISH ecommerce.orders.status-changed` (async)
4. **Pattern Recognition**: Uses "By Pattern" filter
   - Sync operations: Used for queries and immediate responses
   - Async operations: Used for notifications and system integration
5. **Validation**: Checks that order creation triggers event publication
6. **Documentation**: Screenshots unified view for architecture presentation

**Outcome**: Mike confirms system design is coherent and well-documented

**Platform Success**:
- ✅ Can see entire system in one place
- ✅ Easy to identify sync vs async patterns
- ✅ REST and events clearly related (same categories)

---

### Scenario 3: Product Manager Reviews Capabilities

**Context**: Lisa (non-technical PM) needs to understand what the API can do

**Scenario Steps:**

1. **Access**: Opens documentation link
2. **Overview**: Sees clear categories: Products, Orders, Users, Notifications
3. **Exploration**: Clicks "Orders" category
4. **Understanding**: Sees operations in plain language:
   - "Create a new order for products"
   - "Get user's orders"
   - "Publish order created event to notify downstream"
   - "Subscribe to order status changes"
5. **No Confusion**: Doesn't need to understand HTTP methods or Kafka
6. **Focus**: Reads descriptions and understands business capabilities
7. **Schema Review**: Expands "Input Data" for order creation
   - Sees: userId, items, shippingAddress (makes business sense)
   - Doesn't worry about JSON syntax

**Outcome**: Lisa understands API capabilities without technical knowledge

**Platform Success**:
- ✅ Protocol-agnostic terminology
- ✅ Business-focused descriptions
- ✅ Technical details hidden but available

---

### Scenario 4: Developer Needs to Subscribe to Events

**Context**: John needs to build a service that reacts to order events

**Scenario Steps:**

1. **Search**: Types "order events" in search
2. **Results**: Finds "Subscribe to order created events"
3. **Detail View**: Opens operation detail
   - Sees: `SUBSCRIBE` action type
   - Location: `ecommerce.orders.created`
   - Communication: "Publish/Subscribe"
4. **Schema**: Views "Output Data" (messages he'll receive)
   - Sees OrderCreatedPayload schema
   - Reviews example message
5. **Code Example**: Switches to "Java" tab (his preferred language)
   - Sees Kafka consumer setup code
   - Consumer group, deserialization, error handling included
6. **Implementation**: Copies code, adds business logic
7. **Bindings**: Expands "Additional Details"
   - Sees Kafka-specific config (partitions, retention)
   - Uses this for capacity planning

**Outcome**: John built working Kafka consumer in 30 minutes

**Platform Success**:
- ✅ Found async operation easily
- ✅ Clear that it's publish/subscribe pattern
- ✅ Code example production-ready
- ✅ Protocol details available when needed

---

## Navigation Patterns

### Global Navigation Structure

```
Homepage
├── All Operations (Unified List)
│   ├── Filterable by:
│   │   ├── Categories/Tags
│   │   ├── Search term
│   │   ├── Communication Pattern (Sync/Async)
│   │   └── Protocol (REST/Kafka) - optional
│   └── Sortable by:
│       ├── Name (A-Z)
│       └── Category
│
├── By Category
│   ├── Products
│   │   ├── List all products [GET] (REST)
│   │   ├── Get product details [GET] (REST)
│   │   └── Inventory updated [SUBSCRIBE] (Kafka)
│   ├── Orders
│   │   ├── Create order [POST] (REST)
│   │   ├── Get user orders [GET] (REST)
│   │   ├── Order created [PUBLISH] (Kafka)
│   │   ├── Order created [SUBSCRIBE] (Kafka)
│   │   └── Order status changed [PUBLISH] (Kafka)
│   └── ...
│
├── By Communication Pattern
│   ├── Synchronous (Request → Response)
│   │   └── [All REST operations]
│   └── Asynchronous (Publish/Subscribe)
│       └── [All Kafka operations]
│
└── By Protocol (Advanced)
    ├── REST API
    └── Kafka Events
```

### Breadcrumb Examples

**Viewing a REST operation:**
```
Home > All Operations > Create new order
```

**Viewing from category:**
```
Home > Orders > Create new order
```

**Viewing a Kafka operation:**
```
Home > All Operations > Subscribe to order created events
```

**Same operation from pattern view:**
```
Home > Asynchronous Operations > Subscribe to order created events
```

**Key Principle**: Breadcrumbs never emphasize protocol, focus on logical grouping

---

## Code Example Templates

### REST Operation - JavaScript (fetch)

```javascript
// Create new order
async function createOrder(orderData) {
  const response = await fetch('https://api.example.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication header if required
      // 'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const order = await response.json();
  return order;
}

// Example usage:
const newOrder = await createOrder({
  userId: "user-123",
  items: [
    { productId: "prod-456", quantity: 2 },
    { productId: "prod-789", quantity: 1 }
  ],
  shippingAddress: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102"
  }
});

console.log('Order created:', newOrder.id);
```

---

### Kafka Operation - JavaScript (KafkaJS)

```javascript
const { Kafka } = require('kafkajs');

// Initialize Kafka client
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka.example.com:9092']
});

// Subscribe to order created events
async function subscribeToOrderEvents() {
  const consumer = kafka.consumer({ groupId: 'order-processor' });

  await consumer.connect();
  await consumer.subscribe({
    topic: 'ecommerce.orders.created',
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());

      // Process order created event
      console.log('Order created:', event.orderId);
      console.log('User:', event.userId);
      console.log('Total:', event.totalAmount, event.currency);

      // Add your business logic here
      await processOrder(event);
    },
  });
}

// Start subscriber
subscribeToOrderEvents().catch(console.error);
```

---

### Kafka Operation - Python (kafka-python)

```python
from kafka import KafkaConsumer
import json

# Subscribe to order created events
consumer = KafkaConsumer(
    'ecommerce.orders.created',
    bootstrap_servers=['kafka.example.com:9092'],
    group_id='order-processor',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='latest'
)

print("Subscribed to order created events...")

for message in consumer:
    event = message.value

    # Process order created event
    print(f"Order created: {event['orderId']}")
    print(f"User: {event['userId']}")
    print(f"Total: {event['totalAmount']} {event['currency']}")

    # Add your business logic here
    process_order(event)
```

---

## Visual Design Guidelines

### Color Coding for Action Types

**Universal Action Badges:**
- `GET` - 🔵 Blue (#3B82F6) - Read operation
- `POST` - 🟢 Green (#10B981) - Create operation
- `PUT/PATCH` - 🟡 Yellow (#F59E0B) - Update operation
- `DELETE` - 🔴 Red (#EF4444) - Delete operation
- `PUBLISH` - 🟣 Purple (#8B5CF6) - Send message
- `SUBSCRIBE` - 🟠 Orange (#F97316) - Receive message

**Communication Pattern Indicators:**
- Request → Response: `⇄` (bidirectional arrow)
- Publish/Subscribe: `⇉` (broadcast arrow)

**Protocol Badges:**
- REST: `🔷` Small blue diamond
- Kafka: `🟣` Small purple circle
- (Future) GraphQL: `⬡` Pink hexagon
- (Future) gRPC: `▣` Gray square

---

## Accessibility Considerations

### Screen Reader Support

**Operation Card:**
```html
<article aria-label="POST operation: Create new order">
  <span class="action-badge" aria-label="POST method">POST</span>
  <span class="location">/api/orders</span>
  <p class="description">Create a new order for products</p>
  <div class="tags" aria-label="Tags">
    <span>Orders</span>
  </div>
  <span class="protocol-badge" aria-label="Protocol: REST">REST</span>
</article>
```

**Search Results:**
```html
<div role="status" aria-live="polite">
  6 operations found for "order"
</div>
```

### Keyboard Navigation

- `Tab` - Navigate between operations
- `Enter` - Open operation detail
- `/` - Focus search bar
- `Esc` - Clear search / Close modals
- `←` - Back to list
- `↑↓` - Navigate within schemas

---

## Performance Expectations

### Load Times
- **Initial page load**: < 3 seconds
- **Search results**: < 200ms
- **Operation detail**: < 500ms (instant feel)
- **Schema expansion**: < 100ms

### Content Limits
- Support up to **500 operations** in one site
- Support specs up to **5MB** in size
- Search indexes up to **10,000 searchable terms**

---

**Last Updated**: 2025-11-08
**Version**: 1.0.0
