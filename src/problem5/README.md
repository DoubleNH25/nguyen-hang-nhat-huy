# Task Management API

A RESTful API built with Express.js and TypeScript for managing tasks with full CRUD operations. This application provides a robust backend service with data validation, error handling, and SQLite database integration.

## Features

- **Complete CRUD Operations**: Create, Read, Update, and Delete tasks
- **Advanced Filtering**: Filter tasks by status, priority, and search terms
- **Pagination Support**: Efficient data retrieval with pagination
- **Data Validation**: Input validation using Joi schema validation
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Security**: Built-in security features with Helmet and CORS
- **Rate Limiting**: Protection against abuse with request rate limiting
- **TypeScript**: Full TypeScript support for better development experience
- **SQLite Database**: Lightweight database solution for data persistence

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **Validation**: Joi
- **Security**: Helmet, CORS, Express Rate Limit

## Project Structure

```
src/
├── config/
│   └── database.ts          # Database configuration and initialization
├── controllers/
│   └── task.controller.ts   # Request handlers for task operations
├── middleware/
│   ├── error.middleware.ts  # Error handling middleware
│   └── logger.middleware.ts # Request logging middleware
├── routes/
│   └── task.routes.ts       # API route definitions
├── services/
│   └── task.service.ts      # Business logic for task operations
├── types/
│   └── task.types.ts        # TypeScript type definitions
├── validators/
│   └── task.validator.ts    # Input validation schemas
├── app.ts                   # Express application setup
└── server.ts               # Server startup and configuration
```

## Installation and Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Navigate to the project directory**
   ```bash
   cd src/problem5
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your preferred configuration.

4. **Build the project**
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with hot-reload functionality using ts-node-dev.

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Documentation

### Base URL
```
http://localhost:3000/api/tasks
```

### Endpoints

#### 1. Create Task
- **Method**: `POST`
- **URL**: `/api/tasks`
- **Body**:
  ```json
  {
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API documentation",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-string",
      "title": "Complete project documentation",
      "description": "Write comprehensive README and API documentation",
      "status": "pending",
      "priority": "high",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "dueDate": "2024-12-31T23:59:59.000Z"
    },
    "message": "Task created successfully"
  }
  ```

#### 2. Get All Tasks
- **Method**: `GET`
- **URL**: `/api/tasks`
- **Query Parameters**:
  - `status`: Filter by task status (pending, in_progress, completed, cancelled)
  - `priority`: Filter by priority (low, medium, high, urgent)
  - `search`: Search in title and description
  - `sortBy`: Sort field (createdAt, updatedAt, dueDate, priority)
  - `sortOrder`: Sort direction (asc, desc)
  - `limit`: Number of results per page (default: 10, max: 100)
  - `offset`: Number of results to skip (default: 0)

- **Example**: `/api/tasks?status=pending&priority=high&limit=5&offset=0`

- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid-string",
        "title": "Task title",
        "description": "Task description",
        "status": "pending",
        "priority": "high",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "dueDate": "2024-12-31T23:59:59.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 5,
      "offset": 0,
      "hasNext": true,
      "hasPrev": false
    }
  }
  ```

#### 3. Get Task by ID
- **Method**: `GET`
- **URL**: `/api/tasks/:id`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-string",
      "title": "Task title",
      "description": "Task description",
      "status": "pending",
      "priority": "medium",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "dueDate": null
    }
  }
  ```

#### 4. Update Task
- **Method**: `PUT`
- **URL**: `/api/tasks/:id`
- **Body** (all fields optional):
  ```json
  {
    "title": "Updated task title",
    "description": "Updated description",
    "status": "in_progress",
    "priority": "urgent",
    "dueDate": "2024-12-31T23:59:59.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-string",
      "title": "Updated task title",
      "description": "Updated description",
      "status": "in_progress",
      "priority": "urgent",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z",
      "dueDate": "2024-12-31T23:59:59.000Z"
    },
    "message": "Task updated successfully"
  }
  ```

#### 5. Delete Task
- **Method**: `DELETE`
- **URL**: `/api/tasks/:id`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully"
  }
  ```

### Task Status Values
- `pending`: Task is created but not started
- `in_progress`: Task is currently being worked on
- `completed`: Task has been finished
- `cancelled`: Task has been cancelled

### Priority Values
- `low`: Low priority task
- `medium`: Medium priority task (default)
- `high`: High priority task
- `urgent`: Urgent priority task

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `429`: Too Many Requests (rate limiting)
- `500`: Internal Server Error

## Health Check

Check if the server is running:
- **Method**: `GET`
- **URL**: `/health`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600.123
  }
  ```

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the TypeScript project
- `npm start`: Start production server
- `npm run lint`: Run ESLint for code quality
- `npm run format`: Format code with Prettier
- `npm test`: Run tests (when implemented)

### Code Quality

The project includes:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Comprehensive error handling
- Input validation with Joi
- Request logging middleware

## Database

The application uses SQLite for data persistence. The database file is automatically created in the `data/` directory when the server starts. The database schema includes:

- **tasks** table with columns:
  - `id` (TEXT PRIMARY KEY)
  - `title` (TEXT NOT NULL)
  - `description` (TEXT NOT NULL)
  - `status` (TEXT NOT NULL, default: 'pending')
  - `priority` (TEXT NOT NULL, default: 'medium')
  - `created_at` (TEXT NOT NULL)
  - `updated_at` (TEXT NOT NULL)
  - `due_date` (TEXT, optional)

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse with request rate limiting
- **Input Validation**: All inputs are validated using Joi schemas
- **Error Handling**: Prevents sensitive information leakage

## Contributing

1. Follow the existing code style and structure
2. Add proper TypeScript types for new features
3. Include input validation for new endpoints
4. Add appropriate error handling
5. Update documentation for API changes

## License

This project is licensed under the MIT License.