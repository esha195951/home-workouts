# Home Workout Backend

This is the backend API for the Home Workout application. It is built with TypeScript, Express, MongoDB, and JWT-based authentication.

## Features

- User registration and login
- JWT authentication via HTTP-only cookies
- User profile and preference updates
- Workout exercise catalog retrieval
- Workout plan creation and updating
- Workout session logging and history retrieval

## Requirements

- Node.js 18+ (recommended)
- npm
- MongoDB instance or Atlas cluster

## Environment Variables

Create a `.env` file in the `back/` directory with the following variables:

```env
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<jwt-secret>
PORT=5000
```

- `MONGODB_URI`: MongoDB connection URI
- `JWT_SECRET`: Secret key for signing JWT tokens
- `PORT`: Port number for the backend server (default: `5000`)

## Installation

From the `back/` folder:

```bash
npm install
```

## Development

Start the backend in development mode with hot reload:

```bash
npm run dev
```

## Build & Production

Build the TypeScript files:

```bash
npm run build
```

Start the compiled production server:

```bash
npm run start
```

## API Routes

The backend exposes the following routes under `/users` and `/workouts`.

### User Routes

- `POST /users/register`
  - Register a new user
  - Request body: `username`, `password`, `weight`, `birthday`, `gender`, `hasWeights`, `goal`, `frequency`, `sessionLength`

- `POST /users/login`
  - Login and set authentication cookie
  - Request body: `username`, `password`

- `POST /users/logout`
  - Clear the auth cookie and log out

- `GET /users/me`
  - Get current authenticated user profile
  - Requires auth cookie

- `PUT /users/me`
  - Update user profile fields
  - Requires auth cookie
  - Request body: `weight`, `birthday`, `gender`, `hasWeights`, `goal`, `frequency`, `sessionLength`

- `POST /users/details`
  - Update profile details using auth middleware
  - Request body: same as `PUT /users/me`

### Workout Routes

All workout routes require authentication via cookie.

- `GET /workouts/exercises`
  - Returns the list of seeded workout exercises

- `GET /workouts/plan`
  - Returns the authenticated user’s workout plan

- `POST /workouts/plan`
  - Create or upsert a workout plan for the user
  - Request body: `days`

- `PUT /workouts/plan`
  - Update an existing workout plan
  - Request body: `days`

- `POST /workouts/log`
  - Log a completed workout session
  - Request body: `planDay`, `focus`, `workouts`, `status`, `timeTakenSeconds`, `date`

- `GET /workouts/logs`
  - Retrieve workout logs for authenticated user

## Notes

- CORS is configured to allow requests from `http://localhost:5173`.
- Authentication is handled through `httpOnly` cookies, so the frontend must accept cookies from the backend origin.

## MongoDB Schema Overview

The backend stores data in four main collections: `users`, `workoutplans`, `workoutlogs`, and `workoutexercises`.

### `users`
Stores user accounts and profile preferences.

Fields:
- `username` (string) - unique login name
- `password` (string) - hashed password
- `weight` (number)
- `birthday` (date)
- `gender` (string) - one of `male` or `female`
- `hasWeights` (boolean)
- `goal` (string) - `weight_loss` or `muscle_growth`
- `frequency` (number) - workouts per week
- `sessionLength` (number) - planned workout duration in minutes
- timestamps for created/updated records

### `workoutplans`
Stores each user’s current workout plan.

Fields:
- `userId` (ObjectId) - reference to a user
- `days` (array) - each object includes:
  - `day` (number)
  - `focus` (string)
  - `workouts` (array of exercise objects)
- timestamps for created/updated records

### `workoutlogs`
Tracks completed workout sessions and history.

Fields:
- `userId` (ObjectId) - reference to a user
- `planDay` (number)
- `focus` (string)
- `workouts` (array) - each item contains:
  - `name` (string)
  - `completed` (boolean)
- `status` (string) - `completed` or `skipped`
- `timeTakenSeconds` (number)
- `date` (date)
- timestamps for created/updated records

### `workoutexercises`
Contains the seeded exercise library from `Config/SeedExercises.ts`.

Fields:
- `name` (string) - unique exercise identifier
- `description` (string)
- `demonstration_url` (string)
- `gender_recommendation` (object)
- `requires_weight` (boolean)
- `weight_loss_recommended` (number)
- `muscle_growth_recommended` (number)
- `age_recommendation` (object)
- `focus_group` (string)
- `muscles` (array of strings)
- timestamps for created/updated records

## Project Structure

- `server.ts` - app entrypoint
- `Config/Db.ts` - MongoDB connection setup
- `Config/SeedExercises.ts` - initial exercise seeding logic
- `Routes/Routes.ts` - root router
- `Routes/Users.ts` - user authentication and profile APIs
- `Routes/Workouts.ts` - workout plan and log APIs
- `Middleware/Auth.ts` - JWT auth middleware
- `Models/DbModels.ts` - Mongoose models and schemas

## License
MIT
