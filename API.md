# API Documentation

## Base URL

Development: `http://localhost:5000`
Production: `https://your-domain.com`

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained when creating or joining a room.

## Endpoints

### Room Management

#### Create Room
Create a new collaborative room.

**POST** `/rooms/create`

**Request:**
```json
{
  "userName": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "room": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "ABC12345",
    "ownerId": "550e8400-e29b-41d4-a716-446655440001",
    "isLocked": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "participants": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "John Doe",
        "roomId": "550e8400-e29b-41d4-a716-446655440000",
        "isOwner": true,
        "hasControl": true,
        "cursorX": 0,
        "cursorY": 0,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "John Doe",
    "roomId": "550e8400-e29b-41d4-a716-446655440000",
    "isOwner": true,
    "hasControl": true,
    "cursorX": 0,
    "cursorY": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Join Room
Join an existing room using the 8-digit code.

**POST** `/rooms/join`

**Request:**
```json
{
  "roomCode": "ABC12345",
  "userName": "Jane Doe"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "room": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "ABC12345",
    "ownerId": "550e8400-e29b-41d4-a716-446655440001",
    "isLocked": false,
    "currentUrl": "https://example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:31:00Z",
    "participants": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "John Doe",
        "roomId": "550e8400-e29b-41d4-a716-446655440000",
        "isOwner": true,
        "hasControl": true,
        "cursorX": 100,
        "cursorY": 200,
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Jane Doe",
        "roomId": "550e8400-e29b-41d4-a716-446655440000",
        "isOwner": false,
        "hasControl": false,
        "cursorX": 0,
        "cursorY": 0,
        "createdAt": "2024-01-15T10:31:00Z"
      }
    ]
  },
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Jane Doe",
    "roomId": "550e8400-e29b-41d4-a716-446655440000",
    "isOwner": false,
    "hasControl": false,
    "cursorX": 0,
    "cursorY": 0,
    "createdAt": "2024-01-15T10:31:00Z"
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid input
- `404 Not Found` - Room not found
- `403 Forbidden` - Room is locked

#### Get Room Info
Get current room information.

**GET** `/rooms/:roomId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "ABC12345",
  "ownerId": "550e8400-e29b-41d4-a716-446655440001",
  "isLocked": false,
  "currentUrl": "https://example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:31:00Z",
  "participants": [...],
  "chatHistory": [...]
}
```

#### Leave Room
Leave the current room.

**POST** `/rooms/:roomId/leave`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Left room"
}
```

#### Update Room URL
Load a website in the shared browser.

**POST** `/rooms/:roomId/url`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "URL updated"
}
```

**Errors:**
- `403 Forbidden` - Only room owner can update URL

#### Lock/Unlock Room
Lock or unlock the room to prevent new participants.

**POST** `/rooms/:roomId/lock`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "locked": true
}
```

**Response:** `200 OK`
```json
{
  "message": "Room locked"
}
```

#### End Room
Close the room for all participants.

**POST** `/rooms/:roomId/end`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Room ended"
}
```

### User Management

#### Grant Control
Grant a user control over the website.

**POST** `/rooms/:roomId/grant-control`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:** `200 OK`
```json
{
  "message": "Control granted"
}
```

#### Revoke Control
Revoke a user's website control.

**POST** `/rooms/:roomId/revoke-control`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:** `200 OK`
```json
{
  "message": "Control revoked"
}
```

#### Kick User
Remove a user from the room.

**POST** `/rooms/:roomId/kick`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:** `200 OK`
```json
{
  "message": "User kicked"
}
```

**Errors:**
- `403 Forbidden` - Only room owner can kick users

#### Transfer Ownership
Transfer room ownership to another user.

**POST** `/rooms/:roomId/transfer-ownership`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:** `200 OK`
```json
{
  "message": "Ownership transferred"
}
```

## WebSocket Events

Connect to the WebSocket server at `ws://localhost:5000` with authentication:

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
})
```

### Room Events

#### room:join
Join a room via WebSocket.

**Emit:**
```javascript
socket.emit('room:join', { code: 'ABC12345' })
```

**Listen:**
```javascript
socket.on('room:joined', (room) => {
  console.log('Joined room:', room)
})
```

#### room:leave
Leave the current room.

**Emit:**
```javascript
socket.emit('room:leave')
```

#### room:updated
Room state updated.

**Listen:**
```javascript
socket.on('room:updated', (room) => {
  console.log('Room updated:', room)
})
```

#### room:closed
Room was closed.

**Listen:**
```javascript
socket.on('room:closed', (data) => {
  console.log('Room closed:', data.reason)
})
```

### User Events

#### user:joined
New user joined the room.

**Listen:**
```javascript
socket.on('user:joined', (user) => {
  console.log('User joined:', user.name)
})
```

#### user:left
User left the room.

**Listen:**
```javascript
socket.on('user:left', (data) => {
  console.log('User left:', data.userName)
})
```

#### user:list
Get list of room participants.

**Listen:**
```javascript
socket.on('user:list', (users) => {
  console.log('Participants:', users)
})
```

### Cursor Events

#### cursor:move
Update cursor position.

**Emit:**
```javascript
socket.emit('cursor:move', { x: 100, y: 200 })
```

**Listen:**
```javascript
socket.on('cursor:move', (data) => {
  console.log(`${data.userName}'s cursor at ${data.x}, ${data.y}`)
})
```

#### cursor:hide
Hide cursor.

**Listen:**
```javascript
socket.on('cursor:hide', (userId) => {
  console.log('Hide cursor for:', userId)
})
```

### Chat Events

#### chat:message
Send a chat message.

**Emit:**
```javascript
socket.emit('chat:message', { text: 'Hello everyone!' })
```

**Listen:**
```javascript
socket.on('chat:message', (message) => {
  console.log(`${message.userName}: ${message.message}`)
})
```

#### chat:typing
Send typing indicator.

**Emit:**
```javascript
socket.emit('chat:typing', { isTyping: true })
```

**Listen:**
```javascript
socket.on('chat:typing', (data) => {
  console.log(`${data.userName} is ${data.isTyping ? 'typing' : 'stopped typing'}`)
})
```

### Website Events

#### website:load
Load a website URL.

**Emit:**
```javascript
socket.emit('website:load', { url: 'https://example.com' })
```

**Listen:**
```javascript
socket.on('website:load', (data) => {
  console.log('Loading:', data.url)
})
```

#### website:action
Record website interaction.

**Emit:**
```javascript
socket.emit('website:action', {
  type: 'click',
  selector: '.button',
  value: 'clicked'
})
```

**Listen:**
```javascript
socket.on('website:action', (action) => {
  console.log(`${action.userName} performed ${action.type}`)
})
```

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `AUTH_ERROR` - Authentication failed
- `ROOM_NOT_FOUND` - Room doesn't exist
- `ROOM_LOCKED` - Room is locked
- `PERMISSION_DENIED` - User doesn't have permission
- `INVALID_INPUT` - Invalid request data

## Rate Limiting

Requests are limited to:
- **30 requests per minute per IP**

When limit is exceeded:
```json
{
  "message": "Too many requests, please try again later"
}
```

## Response Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Examples

### Create a Room and Join

```javascript
// 1. Create room
const createRes = await fetch('http://localhost:5000/rooms/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userName: 'John' })
})

const { token, room } = await createRes.json()
console.log('Room code:', room.code)

// 2. Connect to WebSocket
const socket = io('http://localhost:5000', { auth: { token } })

socket.on('room:joined', () => {
  console.log('Connected to room!')
  
  // 3. Load a website
  socket.emit('website:load', { url: 'https://example.com' })
  
  // 4. Listen for messages
  socket.on('chat:message', (msg) => {
    console.log(`${msg.userName}: ${msg.message}`)
  })
})
```

### Join an Existing Room

```javascript
// Join
const joinRes = await fetch('http://localhost:5000/rooms/join', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    roomCode: 'ABC12345',
    userName: 'Jane'
  })
})

const { token, room } = await joinRes.json()

// Connect
const socket = io('http://localhost:5000', { auth: { token } })

socket.on('room:joined', () => {
  console.log('Joined room!')
  
  // Send message
  socket.emit('chat:message', { text: 'Hi everyone!' })
})
```

---

For more information, visit the [README.md](./README.md) or [DEVELOPMENT.md](./DEVELOPMENT.md).
