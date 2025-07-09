# Dwello - Real Estate Platform

A full-stack real estate platform built with Next.js (frontend) and Express.js (backend) with Firebase authentication and PostgreSQL database.

## Project Structure

```
dwello-backend-express/     # Express.js backend API
dwello/                     # Next.js frontend application
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Firebase project (for authentication)
- npm or yarn package manager

## Backend Setup (Express.js)

### 1. Navigate to backend directory
```bash
cd dwello-backend-express
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `dwello-backend-express` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/dwello_db"

# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration (for authentication)
FIREBASE_PROJECT_ID="dwello-homes"
FIREBASE_PRIVATE_KEY="your-private-key-here"
FIREBASE_CLIENT_EMAIL="your-client-email@dwello-homes.iam.gserviceaccount.com"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start the backend server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will be running on `http://localhost:5000`

## Frontend Setup (Next.js)

### 1. Navigate to frontend directory
```bash
cd dwello
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the `dwello` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Configuration (already configured in lib/firebase.ts)
```

### 4. Start the frontend development server
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property (requires auth)
- `PUT /api/properties/:id` - Update property (requires auth)
- `DELETE /api/properties/:id` - Delete property (requires auth)

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:slug` - Get agent by slug
- `GET /api/agents/me` - Get current agent profile (requires auth)
- `POST /api/agents` - Create new agent (requires auth)
- `PUT /api/agents/me` - Update current agent (requires auth)

### Amenities
- `GET /api/amenities` - Get all amenities

## Authentication

The application uses Firebase Authentication with JWT tokens. Users can:
- Sign up with email/password
- Sign in with Google or Facebook
- Register as real estate agents

## Database Schema

The application uses PostgreSQL with the following main tables:
- `properties` - Property listings
- `agents` - Real estate agents
- `amenities` - Property amenities
- `property_amenities` - Junction table for property-amenity relationships
- `blog_posts` - Blog posts (future feature)

## Features

### Frontend
- Modern, responsive UI with Tailwind CSS
- Property search and filtering
- Agent profiles and registration
- User authentication with Firebase
- Property listing creation and management
- Admin dashboard (in development)

### Backend
- RESTful API with Express.js
- PostgreSQL database with Prisma ORM
- Firebase authentication middleware
- CORS configuration for frontend integration
- Input validation and error handling

## Development

### Running both servers
You can run both servers simultaneously:

**Terminal 1 (Backend):**
```bash
cd dwello-backend-express
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd dwello
npm run dev
```

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name migration_name
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS_ORIGIN is set to `http://localhost:3000`
2. **Database Connection**: Verify your PostgreSQL connection string in the `.env` file
3. **Firebase Auth**: Make sure your Firebase service account key is properly configured
4. **Port Conflicts**: Ensure ports 3000 (frontend) and 5000 (backend) are available

### Getting Help

If you encounter issues:
1. Check the console logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure the database is running and accessible
4. Check that Firebase project is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
