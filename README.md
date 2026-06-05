# Microservices Backend

Frontend (React) + Backend (nestjs microservices)

## Backend Architecture 

- **Products** — REST API for product CRUD with pagination. Uses PostgreSQL (Prisma ORM). Publishes `product.created` / `product.deleted` events to RabbitMQ.
- **Notifications** — RabbitMQ consumer that listens to product events and logs them.
- **Shared library** (`@app/common`) — event contracts shared between services.

## Quick Start

### Prerequisites

- Docker & Docker Compose

### Run

```bash
# Copy environment files
cp apps/products/.env.example apps/products/.env
cp apps/notifications/.env.example apps/notifications/.env

# Start all services
docker compose up --build
```

The Products API will be available at `http://localhost:3000`.

## API Endpoints

### Products

| Method | Endpoint          | Description                        |
| ------ | ----------------- | ---------------------------------- |
| POST   | `/products`       | Create a product                   |
| DELETE  | `/products/:id`   | Delete a product by ID             |
| GET    | `/products`       | List products (paginated)          |

#### Create Product

```json
POST /products
{
  "name": "Laptop",
  "description": "A powerful laptop",
  "price": 999.99
}
```

#### List Products (Pagination)

```
GET /products?page=1&limit=10
```

Response:

```json
{
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

## Project Structure

```
apps/
  products/          # Products REST API microservice
    prisma/          # Prisma schema & migrations
    src/
  notifications/     # Notifications consumer microservice
    src/
libs/
  common/            # Shared contracts & constants
    src/contracts/
```
## Frontend startup

copy .env.example content to .env file 
npm run dev
