# Task Manager API

A RESTful API for managing tasks, built with **Node.js** and **Express.js** using in-memory data storage. Supports full CRUD operations, input validation, error handling, filtering, sorting, and priority-based lookup.

Submitted as **Assignment 1** for the AirTribe Backend Engineering Launchpad.

---

## Features

- Full CRUD on `/tasks` (Create, Read, Update, Delete)
- Input validation on `title`, `description`, `completed`, and `priority`
- Structured error responses (`400` for invalid input, `404` for missing resources)
- Filtering by completion status: `GET /tasks?completed=true`
- Sorting by creation date: `GET /tasks?order=asc|desc`
- Priority attribute (`low` / `medium` / `high`) with dedicated lookup endpoint
- 19 automated test assertions via `tap` + `supertest`

---

## Tech Stack

- **Runtime:** Node.js (>= 18)
- **Framework:** Express 4
- **Storage:** In-memory (seeded from `task.json`)
- **Testing:** tap + supertest

---

## Setup

### Prerequisites
- Node.js **v18 or higher**
- npm

### Install & run

```bash
# 1. Clone
git clone <repo-url>
cd task-manager-api-Manoj-p2304

# 2. Install dependencies
npm install

# 3. Start the server
node app.js
# → Server is listening on 3000

# 4. Run the test suite
npm test
```

The API will be available at `http://localhost:3000`.

---

## Task Schema

```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "medium",
  "createdAt": "2026-05-01T12:00:00.000Z"
}
```

| Field         | Type      | Required | Notes                                       |
|---------------|-----------|----------|---------------------------------------------|
| `id`          | number    | auto     | Auto-incremented on creation                |
| `title`       | string    | yes      | Non-empty (whitespace trimmed)              |
| `description` | string    | yes      | Non-empty (whitespace trimmed)              |
| `completed`   | boolean   | yes      | Strict boolean — `"true"` is **rejected**   |
| `priority`    | string    | no       | `low` \| `medium` \| `high` (default `medium`) |
| `createdAt`   | ISO date  | auto     | Set on creation, immutable                  |

---

## API Endpoints

Base URL: `http://localhost:3000`

### `GET /tasks`
Retrieve all tasks. Supports filtering and sorting via query params.

| Query param | Values            | Description                          |
|-------------|-------------------|--------------------------------------|
| `completed` | `true` \| `false` | Filter by completion status          |
| `order`     | `asc` \| `desc`   | Sort by `createdAt` (default `asc`)  |

**Examples**
```bash
curl http://localhost:3000/tasks
curl 'http://localhost:3000/tasks?completed=true'
curl 'http://localhost:3000/tasks?completed=false&order=desc'
```

**Response:** `200 OK` — array of tasks

---

### `GET /tasks/:id`
Retrieve a single task by id.

```bash
curl http://localhost:3000/tasks/1
```

**Responses:**
- `200 OK` — task object
- `404 Not Found` — id does not exist or is invalid

---

### `GET /tasks/priority/:level`
Retrieve all tasks at the given priority.

```bash
curl http://localhost:3000/tasks/priority/high
```

**Responses:**
- `200 OK` — array of tasks (may be empty)
- `400 Bad Request` — `:level` is not `low`/`medium`/`high`

---

### `POST /tasks`
Create a new task.

```bash
curl -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Ship feature",
    "description": "Deploy to production",
    "completed": false,
    "priority": "high"
  }'
```

**Required body:** `title`, `description`, `completed`
**Optional body:** `priority` (defaults to `medium`)

**Responses:**
- `201 Created` — newly created task
- `400 Bad Request` — invalid or missing fields

---

### `PUT /tasks/:id`
Update an existing task. All required fields must be provided.

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Updated",
    "description": "New description",
    "completed": true,
    "priority": "low"
  }'
```

**Responses:**
- `200 OK` — updated task
- `400 Bad Request` — invalid body
- `404 Not Found` — id does not exist

---

### `DELETE /tasks/:id`
Delete a task by id.

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Responses:**
- `200 OK` — deleted task object
- `404 Not Found` — id does not exist

---

## Error Format

All errors return a JSON body of the form:

```json
{ "error": "human-readable message" }
```

| Status | When                                                       |
|--------|------------------------------------------------------------|
| 400    | Validation failure, malformed JSON, bad query value        |
| 404    | Task id not found, or unknown route                        |
| 500    | Unhandled internal error                                   |

---

## Testing

### Automated tests
```bash
npm test
```
Runs 10 test cases / 19 assertions covering happy paths and validation/error cases for every endpoint.

### Manual testing with curl

```bash
# Create
curl -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Read book","description":"Finish chapter 4","completed":false,"priority":"low"}'

# List with filter + sort
curl 'http://localhost:3000/tasks?completed=false&order=desc'

# Get one
curl http://localhost:3000/tasks/1

# Get by priority
curl http://localhost:3000/tasks/priority/medium

# Update
curl -X PUT http://localhost:3000/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{"title":"Done","description":"All good","completed":true,"priority":"high"}'

# Delete
curl -X DELETE http://localhost:3000/tasks/1

# Validation failure (empty title)
curl -i -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"  ","description":"x","completed":false}'

# Validation failure (completed not boolean)
curl -i -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"a","description":"b","completed":"true"}'

# 404 — non-existent id
curl -i http://localhost:3000/tasks/999
```

### Manual testing with Postman
1. Import the base URL `http://localhost:3000`.
2. Create a new collection with one request per endpoint above.
3. Set the **Body** type to `raw` → `JSON` for `POST` and `PUT`.
4. Verify status codes match the table in each endpoint section.

---

## Project Structure

```
task-manager-api-Manoj-p2304/
├── app.js              # Express app, routes, validation, error handlers
├── task.json           # Seed data (loaded into memory on startup)
├── package.json
├── test/
│   └── server.test.js  # tap + supertest test suite
└── README.md
```

---

## License

ISC
