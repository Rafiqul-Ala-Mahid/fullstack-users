# Full-Stack Users Management Application

A modern full-stack application for managing users with search, filtering, sorting, and real-time updates.

## Features

### Backend
- ✅ RESTful API with Express and TypeScript
- ✅ MongoDB database with Prisma ORM
- ✅ User CRUD operations
- ✅ Search by name
- ✅ Filter by role
- ✅ Toggle active status

### Frontend
- ✅ React 18 with TypeScript
- ✅ Vite for fast development
- ✅ TanStack Query (React Query) for data fetching
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui components
- ✅ Real-time search with debouncing
- ✅ Automatic query cancellation
- ✅ Sorting by name (ascending/descending)
- ✅ Optimistic updates for toggle active
- ✅ Loading skeletons
- ✅ Activity timer showing profile viewing duration

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Prisma ORM
- CORS

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Query (React Query)
- Tailwind CSS
- shadcn/ui components
- Axios
- Lucide Icons

## Project Structure

```
fullstack-users/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── users.ts
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── badge.tsx
    │   │   │   ├── button.tsx
    │   │   │   ├── card.tsx
    │   │   │   ├── input.tsx
    │   │   │   ├── select.tsx
    │   │   │   └── skeleton.tsx
    │   │   ├── SearchFilters.tsx
    │   │   ├── SortButton.tsx
    │   │   ├── UserDetails.tsx
    │   │   └── UsersList.tsx
    │   ├── hooks/
    │   │   ├── useDebounce.ts
    │   │   ├── useUsers.ts
    │   │   └── useViewingTimer.ts
    │   ├── lib/
    │   │   └── utils.ts
    │   ├── types/
    │   │   └── user.ts
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (v20.19+ or v22.12+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:

   Update `.env` file with your MongoDB connection string:
   ```
   DATABASE_URL="mongodb://localhost:27017/fullstack_users"
   PORT=3001
   ```

   For MongoDB Atlas, use:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/fullstack_users"
   ```

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

5. Push schema to database:
   ```bash
   npm run prisma:push
   ```

6. Seed the database with sample users:
   ```bash
   npm run seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## API Endpoints

### GET /users
Fetch all users with optional filtering

**Query Parameters:**
- `search` (string, optional): Search users by name
- `role` (string, optional): Filter by role (admin, editor, viewer)

**Example:**
```bash
GET http://localhost:3001/users?search=john&role=admin
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "admin",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET /users/:id
Fetch a single user by ID

**Example:**
```bash
GET http://localhost:3001/users/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "admin",
  "active": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### PATCH /users/:id/toggle-active
Toggle user's active status

**Example:**
```bash
PATCH http://localhost:3001/users/507f1f77bcf86cd799439011/toggle-active
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "admin",
  "active": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## Key Features Implementation

### 1. Search with Query Cancellation
The search input uses debouncing (300ms) to prevent excessive API calls. When typing quickly, React Query automatically cancels previous requests using AbortController.

```typescript
// Debounce hook
const debouncedSearch = useDebounce(search, 300);

// React Query automatically cancels previous requests
const { data: users } = useUsers({
  search: debouncedSearch,
  role: role || undefined,
});
```

### 2. Sorting
Sorting is implemented client-side with three states: none, ascending, and descending.

```typescript
const sortedUsers = useMemo(() => {
  if (!users || sortDirection === "none") return users;
  return [...users].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortDirection === "asc" ? comparison : -comparison;
  });
}, [users, sortDirection]);
```

The sort button is disabled while data is loading.

### 3. Optimistic Updates
When toggling a user's active status, the UI updates immediately before the server responds:

```typescript
onMutate: async (userId: string) => {
  await queryClient.cancelQueries({ queryKey: ["users"] });

  const previousUsers = queryClient.getQueryData(["users"]);

  queryClient.setQueriesData({ queryKey: ["users"] }, (old) =>
    old?.map((user) =>
      user.id === userId ? { ...user, active: !user.active } : user
    )
  );

  return { previousUsers, userId };
}
```

If the request fails, the UI automatically rolls back to the previous state.

### 4. Activity Indicator
A custom hook tracks how long a user profile has been viewed:

```typescript
const viewingSeconds = useViewingTimer(selectedUserId);
```

The timer resets when switching to a different user.

### 5. Loading States
- Skeleton loaders for user list
- Skeleton loaders for user details
- Disabled sort button during loading
- Loading text on toggle button

## User Model

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  active: boolean;
  createdAt: Date;
}
```

## Development Scripts

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production build
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema to database
npm run seed         # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in the `dist` folder and can be served with any static file server.

## Environment Variables

### Backend (.env)
```
DATABASE_URL="mongodb://localhost:27017/fullstack_users"
PORT=3001
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check network connectivity for MongoDB Atlas
- Verify IP whitelist in MongoDB Atlas

### CORS Issues
- Backend CORS is configured to allow all origins in development
- Update CORS settings in `backend/src/index.ts` for production

### Port Already in Use
- Change the PORT in backend `.env` file
- Update API_BASE_URL in `frontend/src/api/users.ts`

## Future Enhancements

- [ ] User creation and editing
- [ ] User deletion
- [ ] Pagination for large datasets
- [ ] Advanced filtering
- [ ] Export users to CSV
- [ ] User authentication and authorization
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] Deployment configuration

## License

MIT
