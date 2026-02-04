# API Usage Examples

This document provides practical examples of how to use the Task Management API.

## Prerequisites

Make sure the server is running:
```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Example API Calls

### 1. Health Check

```bash
# Check if server is running
curl -X GET http://localhost:3000/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-04T05:42:28.174Z",
  "uptime": 17.2847301
}
```

### 2. Create a New Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API documentation",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "be7b6dcb-8030-406a-bb4c-07a62e7e2056",
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API documentation",
    "status": "pending",
    "priority": "high",
    "createdAt": "2026-02-04T05:42:49.582Z",
    "updatedAt": "2026-02-04T05:42:49.582Z",
    "dueDate": "2024-12-31T23:59:59.000Z"
  },
  "message": "Task created successfully"
}
```

### 3. Get All Tasks

```bash
# Get all tasks
curl -X GET http://localhost:3000/api/tasks

# Get tasks with filters
curl -X GET "http://localhost:3000/api/tasks?status=pending&priority=high&limit=5"

# Search tasks
curl -X GET "http://localhost:3000/api/tasks?search=documentation&sortBy=createdAt&sortOrder=desc"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "be7b6dcb-8030-406a-bb4c-07a62e7e2056",
      "title": "Complete project documentation",
      "description": "Write comprehensive README and API documentation",
      "status": "pending",
      "priority": "high",
      "createdAt": "2026-02-04T05:42:49.582Z",
      "updatedAt": "2026-02-04T05:42:49.582Z",
      "dueDate": "2024-12-31T23:59:59.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 4. Get Task by ID

```bash
curl -X GET http://localhost:3000/api/tasks/be7b6dcb-8030-406a-bb4c-07a62e7e2056
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "be7b6dcb-8030-406a-bb4c-07a62e7e2056",
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API documentation",
    "status": "pending",
    "priority": "high",
    "createdAt": "2026-02-04T05:42:49.582Z",
    "updatedAt": "2026-02-04T05:42:49.582Z",
    "dueDate": "2024-12-31T23:59:59.000Z"
  }
}
```

### 5. Update Task

```bash
curl -X PUT http://localhost:3000/api/tasks/be7b6dcb-8030-406a-bb4c-07a62e7e2056 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "urgent"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "be7b6dcb-8030-406a-bb4c-07a62e7e2056",
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API documentation",
    "status": "in_progress",
    "priority": "urgent",
    "createdAt": "2026-02-04T05:42:49.582Z",
    "updatedAt": "2026-02-04T05:43:15.123Z",
    "dueDate": "2024-12-31T23:59:59.000Z"
  },
  "message": "Task updated successfully"
}
```

### 6. Delete Task

```bash
curl -X DELETE http://localhost:3000/api/tasks/be7b6dcb-8030-406a-bb4c-07a62e7e2056
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Error Examples

### Validation Error
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "description": "Invalid task"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Title is required"
}
```

### Task Not Found
```bash
curl -X GET http://localhost:3000/api/tasks/invalid-id
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Task not found"
}
```

## Using with JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/tasks';

// Create a task
async function createTask() {
  try {
    const response = await axios.post(API_BASE_URL, {
      title: 'Learn TypeScript',
      description: 'Complete TypeScript tutorial and build a project',
      priority: 'medium',
      dueDate: '2024-12-31T23:59:59.000Z'
    });
    
    console.log('Task created:', response.data);
    return response.data.data.id;
  } catch (error) {
    console.error('Error creating task:', error.response.data);
  }
}

// Get all tasks
async function getAllTasks() {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        status: 'pending',
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
    });
    
    console.log('Tasks:', response.data);
  } catch (error) {
    console.error('Error fetching tasks:', error.response.data);
  }
}

// Update a task
async function updateTask(taskId) {
  try {
    const response = await axios.put(`${API_BASE_URL}/${taskId}`, {
      status: 'completed'
    });
    
    console.log('Task updated:', response.data);
  } catch (error) {
    console.error('Error updating task:', error.response.data);
  }
}

// Example usage
async function main() {
  const taskId = await createTask();
  await getAllTasks();
  if (taskId) {
    await updateTask(taskId);
  }
}

main();
```

## Testing with Postman

1. Import the following collection into Postman:

```json
{
  "info": {
    "name": "Task Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Create Task",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Sample Task\",\n  \"description\": \"This is a sample task\",\n  \"priority\": \"medium\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/tasks",
          "host": ["{{baseUrl}}"],
          "path": ["api", "tasks"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

2. Set the environment variable `baseUrl` to `http://localhost:3000`
3. Run the requests to test the API

## Performance Testing

For load testing, you can use tools like Apache Bench (ab):

```bash
# Test creating tasks (POST)
ab -n 100 -c 10 -T 'application/json' -p post_data.json http://localhost:3000/api/tasks

# Test getting tasks (GET)
ab -n 1000 -c 50 http://localhost:3000/api/tasks
```

Where `post_data.json` contains:
```json
{
  "title": "Load test task",
  "description": "This is a load test task",
  "priority": "low"
}
```