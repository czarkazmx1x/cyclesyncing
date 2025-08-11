# Women's Health Cycle Sync App - Backend

This directory contains the Node.js/Express backend for the Women's Health Cycle Sync App.

## Structure

- `src/` - Source code
  - `controllers/` - Request handlers
  - `models/` - Database models
  - `routes/` - API routes
  - `middleware/` - Custom middleware
  - `services/` - Business logic
  - `utils/` - Utility functions
- `prisma/` - Database schema and migrations
- `config/` - Configuration files
- `tests/` - Unit and integration tests

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   ```
   cp .env.example .env
   ```

3. Run database migrations:
   ```
   npx prisma migrate dev
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `DELETE /api/users/me` - Delete user account

### Cycles
- `GET /api/cycles` - Get user's cycle history
- `POST /api/cycles` - Log a new cycle
- `GET /api/cycles/:id` - Get specific cycle details
- `PUT /api/cycles/:id` - Update cycle details
- `DELETE /api/cycles/:id` - Delete a cycle

### Symptoms
- `GET /api/symptoms` - Get all tracked symptoms
- `POST /api/symptoms` - Log new symptoms
- `PUT /api/symptoms/:id` - Update symptom entry
- `DELETE /api/symptoms/:id` - Delete symptom entry

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/recommendations/:phase` - Get phase-specific recommendations

## Database Schema

See the Prisma schema file (`prisma/schema.prisma`) for the complete database structure.

## Security Measures

- HTTPS-only communication
- JWT with short expiration
- Encryption for sensitive data
- Rate limiting for API endpoints
- Input validation and sanitization
- CORS configuration
