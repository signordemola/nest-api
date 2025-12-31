# NestJS API Core

## Overview
A high-performance backend architecture built with NestJS and Prisma ORM. This system implements a modular design to handle user authentication, role-based access control, and a relational content structure for posts and comments.

## Features
- NestJS: Modular architecture for scalable server-side applications.
- Prisma: Type-safe database client and automated migration management.
- Passport.js: Multi-strategy authentication (Local & JWT).
- PostgreSQL: Relational data storage for complex entity relationships.
- Class Validator: Robust request body validation and data sanitization.

## Getting Started
### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/signordemola/nest-api.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```
4. Start the application:
   ```bash
   npm run start:dev
   ```

### Environment Variables
Configure the following variables in a `.env` file at the project root:
```text
DATABASE_URL="postgresql://user:password@localhost:5432/nest_db?schema=public"
JWT_SECRET="your_secure_random_string_here"
PORT=3000
```

## API Documentation
### Base URL
`http://localhost:3000`

### Endpoints

#### POST /auth/register
**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "username": "johndoe"
}
```
**Response**:
```json
{
  "message": "Registration successful!"
}
```
**Errors**:
- 409: Email already in use!

#### POST /auth/login
**Request**:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```
**Response**:
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "roles": ["USER"]
  }
}
```
**Errors**:
- 401: Invalid credentials

#### GET /profile
**Request**:
- Header: `Authorization: Bearer <token>`
**Response**:
```json
{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "roles": ["USER"],
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:00:00Z"
}
```

#### GET /users
**Request**:
- Header: `Authorization: Bearer <token>` (Admin Only)
**Response**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["USER"]
  }
]
```

#### GET /posts
**Request**:
- Query Params: `tag` (optional), `authorId` (optional)
**Response**:
```json
[
  {
    "id": 1,
    "title": "Project Update",
    "content": "Description here",
    "author": { "id": 1, "name": "John Doe" },
    "tags": [{ "id": 1, "name": "tech" }],
    "_count": { "comments": 5 }
  }
]
```

#### POST /posts
**Request**:
- Header: `Authorization: Bearer <token>`
```json
{
  "title": "New Post",
  "content": "Post body content",
  "tags": ["nodejs", "nestjs"]
}
```
**Response**:
```json
{
  "message": "Post created successfully"
}
```

#### PATCH /posts/:id
**Request**:
- Header: `Authorization: Bearer <token>`
```json
{
  "title": "Updated Title"
}
```
**Response**:
```json
{
  "message": "Post with the title: 1 updated successfully!"
}
```

#### DELETE /posts/:id
**Request**:
- Header: `Authorization: Bearer <token>`
**Response**:
```json
{
  "message": "Post deleted successfully!"
}
```

#### POST /posts/:postId/comments
**Request**:
- Header: `Authorization: Bearer <token>`
```json
{
  "content": "This is a comment"
}
```
**Response**:
```json
{
  "message": "Comment added successfully!"
}
```

#### PATCH /posts/:postId/comments/:commentId
**Request**:
- Header: `Authorization: Bearer <token>`
```json
{
  "content": "Updated comment content"
}
```
**Response**:
```json
{
  "message": "Comment updated successfully!"
}
```

#### DELETE /posts/:postId/comments/:commentId
**Request**:
- Header: `Authorization: Bearer <token>`
**Response**:
```json
{
  "message": "Comment deleted successfully!"
}
```

## Technologies Used

| Technology | Purpose | Link |
| :--- | :--- | :--- |
| NestJS | Backend Framework | [https://nestjs.com/](https://nestjs.com/) |
| Prisma | ORM | [https://www.prisma.io/](https://www.prisma.io/) |
| Passport | Authentication | [http://www.passportjs.org/](http://www.passportjs.org/) |
| TypeScript | Language | [https://www.typescriptlang.org/](https://www.typescriptlang.org/) |
| PostgreSQL | Database | [https://www.postgresql.org/](https://www.postgresql.org/) |

## Contributing
- Fork the repository.
- Create a feature branch: `git checkout -b feature/new-feature`.
- Commit changes: `git commit -m 'Add new feature'`.
- Push to the branch: `git push origin feature/new-feature`.
- Submit a Pull Request.

## Author
**Signordemola**
- GitHub: [signordemola](https://github.com/signordemola)
- LinkedIn: [Placeholder]
- Twitter: [Placeholder]

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)