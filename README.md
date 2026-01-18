# Full-Stack Users Management Application

A modern full-stack application for managing users with search, filtering, sorting, and real-time updates.

## Features

### Backend
- ✅ RESTful API with Express and TypeScript
- ✅ MongoDB database with Prisma ORM
- ✅ Search by name and filter by role
- ✅ Toggle active status

### Frontend
- ✅ React 18 with TypeScript and Vite
- ✅ TanStack Query (React Query) for data fetching
- ✅ Tailwind CSS with shadcn/ui components
- ✅ Real-time search with debouncing and query cancellation
- ✅ Client-side sorting (ascending/descending)
- ✅ Optimistic updates
- ✅ Loading skeletons
- ✅ Activity timer (bonus feature)

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, MongoDB, Prisma
- **Frontend:** React 18, TypeScript, Vite, TanStack Query, Tailwind CSS, Axios

## Quick Start

### Prerequisites
- Node.js (v20.18+)
- MongoDB (local or Atlas)

### Setup

1. **Clone and install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure backend (.env):**
   ```
   DATABASE_URL="mongodb://localhost:27017/fullstack_users"
   PORT=3001
   ```

   For MongoDB Atlas:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/fullstack_users"
   ```

3. **Setup database:**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:push
   npm run seed
   ```

4. **Run development servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

5. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## API Endpoints

### GET /users
Fetch users with optional filtering
- Query params: `search` (string), `role` (admin|editor|viewer)
- Example: `/users?search=john&role=admin`

### GET /users/:id
Get single user by ID

### PATCH /users/:id/toggle-active
Toggle user's active status

## Deployment (Vercel)

### Backend Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/fullstack-users.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com/new
   - Import your repository
   - **Root Directory:** Select `backend`
   - **Framework:** Other
   - **Environment Variables:**
     - `DATABASE_URL`: Your MongoDB Atlas connection string
   - Click Deploy

3. **MongoDB Atlas Setup:**
   - Go to https://cloud.mongodb.com
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

4. **Test:** Visit `https://your-backend.vercel.app/users`

### Frontend Deployment

1. **Deploy on Vercel:**
   - Import same repository
   - **Root Directory:** Select `frontend`
   - **Framework:** Vite
   - **Environment Variables:**
     - `VITE_API_URL`: Your backend URL
   - Click Deploy

2. **Update CORS:**
   - Edit `backend/src/index.ts` line 12
   - Add your frontend URL to `allowedOrigins` array
   - Push changes (Vercel auto-redeploys)

## Project Structure

```
fullstack-users/
├── backend/
│   ├── api/                    # Vercel serverless entry
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Sample data
│   └── src/
│       └── index.ts            # Express app
├── frontend/
│   └── src/
│       ├── api/                # API client
│       ├── components/         # React components
│       ├── hooks/              # Custom hooks
│       └── types/              # TypeScript types
└── README.md
```

## Key Features

### Search with Query Cancellation
Debounced search (300ms) with automatic cancellation of previous requests using React Query's AbortController support.

### Optimistic Updates
UI updates immediately when toggling user status. Automatically rolls back on error.

### Client-Side Sorting
Three states: none → ascending → descending. Disabled during loading.

### Activity Timer
Tracks and displays how long a user profile has been viewed.

## Scripts

### Backend
```bash
npm run dev              # Development server
npm run build            # Build for production
npm run prisma:generate  # Generate Prisma client
npm run seed             # Seed database
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Build for production
```

## Troubleshooting

**MongoDB Connection Failed:**
- Check connection string
- For Atlas: Network Access → Allow 0.0.0.0/0

**CORS Errors:**
- Add frontend URL to backend CORS config (`backend/src/index.ts`)

**Vercel Build Failed:**
- Verify Root Directory is set correctly
- Check environment variables are set
- Review Vercel build logs

## License

MIT
