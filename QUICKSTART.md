# Quick Start Guide

Get the application up and running in minutes.

## Prerequisites

- Node.js (v20.19+ or v22.12+)
- MongoDB running locally on port 27017 (or use MongoDB Atlas)

## Quick Setup

### 1. Install All Dependencies

From the root directory:

```bash
npm run install-all
```

Or manually:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**

Update `backend/.env`:
```
DATABASE_URL="mongodb://localhost:27017/fullstack_users"
PORT=3001
```

**Option B: MongoDB Atlas**

Update `backend/.env`:
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/fullstack_users"
PORT=3001
```

### 3. Setup Backend Database

From the root directory:

```bash
npm run setup-backend
```

Or manually:

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed with sample data
npm run seed
```

### 4. Start the Application

Open **two separate terminals**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on http://localhost:5173

### 5. Open the Application

Navigate to http://localhost:5173 in your browser.

## What You'll See

1. **Users List (Left Panel)**
   - 10 sample users
   - Search by name
   - Filter by role
   - Sort by name

2. **User Details (Right Panel)**
   - Click any user to view details
   - Activity timer shows viewing duration
   - Toggle active/inactive status

## Sample Users

The seed script creates 10 users:
- John Doe (Admin, Active)
- Jane Smith (Viewer, Inactive)
- Bob Johnson (Editor, Active)
- Alice Williams (Admin, Active)
- Charlie Brown (Viewer, Active)
- Diana Prince (Editor, Inactive)
- Edward Norton (Viewer, Active)
- Fiona Green (Admin, Active)
- George Lucas (Editor, Inactive)
- Hannah Montana (Viewer, Active)

## Features to Try

1. **Search**: Type in the search box to filter users by name
2. **Filter**: Select a role from the dropdown to filter
3. **Sort**: Click "Sort by Name" to sort ascending/descending
4. **View Details**: Click any user to see full details
5. **Toggle Status**: Click "Activate User" or "Deactivate User" button
6. **Activity Timer**: Watch the viewing timer count up in the bonus section

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (if using local)
mongod
```

### Port Already in Use
```bash
# Backend (change PORT in backend/.env)
PORT=3002

# Frontend (Vite will auto-suggest another port)
```

### API Not Responding
- Ensure backend is running on http://localhost:3001
- Check backend terminal for errors
- Verify MongoDB connection string in .env

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints
- Review the code structure
- Try modifying the UI or adding features

Enjoy! 🎉
