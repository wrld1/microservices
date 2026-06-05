# Microservices Backend

NestJS monorepo with two microservices communicating via RabbitMQ.

## Architecture

- **Products** — REST API for product CRUD with pagination. Uses PostgreSQL (Prisma ORM). Publishes `product.created` / `product.deleted` events to RabbitMQ.
- **Notifications** — RabbitMQ consumer that listens to product events and logs them.
- **Shared library** (`@app/common`) — event contracts shared between services.

## Tech Stack

- TypeScript, NestJS
- PostgreSQL + Prisma ORM (with migrations)
- RabbitMQ for inter-service messaging
- Docker Compose for local development

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

RabbitMQ Management UI: `http://localhost:15672` (guest/guest).

### Local Development (without Docker)

```bash
npm install

# Generate Prisma client
npx prisma generate --schema=apps/products/prisma/schema.prisma

# Run migrations (requires a running PostgreSQL instance)
npx prisma migrate deploy --schema=apps/products/prisma/schema.prisma

# Start Products service
npm run start:dev products

# Start Notifications service (in a separate terminal)
npm run start:dev notifications
```

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
