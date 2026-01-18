# Full-Stack Users Application - Project Summary

## Overview

A modern full-stack application demonstrating best practices for user management with React, TypeScript, Express, and MongoDB.

## Completed Features

### ✅ Backend (Express + TypeScript + MongoDB + Prisma)

1. **API Endpoints**
   - `GET /users` - List users with search and role filter
   - `GET /users/:id` - Get single user details
   - `PATCH /users/:id/toggle-active` - Toggle user active status

2. **Database**
   - MongoDB with Prisma ORM
   - User model with id, name, email, role, active, createdAt
   - Enum for roles: admin, editor, viewer
   - Seed script with 10 sample users

3. **Features**
   - CORS enabled for frontend
   - Type-safe API with TypeScript
   - Error handling middleware
   - Graceful shutdown

### ✅ Frontend (React + TypeScript + Vite + Tailwind + React Query)

1. **UI Components (shadcn/ui style)**
   - Input (search field)
   - Select (role filter dropdown)
   - Button (sort, toggle active)
   - Badge (role and status indicators)
   - Card (user details container)
   - Skeleton (loading states)

2. **Feature Components**
   - SearchFilters - Search input and role dropdown
   - UsersList - Scrollable list of users
   - UserDetails - Detailed user information panel
   - SortButton - Three-state sort control

3. **Hooks**
   - `useUsers` - Fetch users with React Query
   - `useUser` - Fetch single user details
   - `useToggleUserActive` - Mutation with optimistic updates
   - `useDebounce` - Debounce search input
   - `useViewingTimer` - Track profile viewing duration

4. **Advanced Features**
   - ✅ **Search with debouncing** (300ms delay)
   - ✅ **Automatic query cancellation** (React Query built-in)
   - ✅ **Role filtering** (Admin, Editor, Viewer)
   - ✅ **Sorting by name** (None, Asc, Desc)
   - ✅ **Optimistic updates** for toggle active
   - ✅ **Loading skeletons** for better UX
   - ✅ **Activity timer** showing viewing duration
   - ✅ **Disabled sort during loading**
   - ✅ **Responsive design** with Tailwind CSS

## Project Structure

```
fullstack-users/
├── README.md                 # Comprehensive documentation
├── QUICKSTART.md            # Quick start guide
├── PROJECT_SUMMARY.md       # This file
├── package.json             # Root package with helper scripts
├── .gitignore              # Root gitignore
│
├── backend/
│   ├── src/
│   │   └── index.ts         # Express server with all endpoints
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeder
│   ├── package.json         # Backend dependencies
│   ├── tsconfig.json        # TypeScript config
│   ├── .env                 # Environment variables
│   └── .gitignore          # Backend gitignore
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── users.ts           # API client
    │   ├── components/
    │   │   ├── ui/                # shadcn/ui components
    │   │   │   ├── badge.tsx
    │   │   │   ├── button.tsx
    │   │   │   ├── card.tsx
    │   │   │   ├── input.tsx
    │   │   │   ├── select.tsx
    │   │   │   └── skeleton.tsx
    │   │   ├── SearchFilters.tsx  # Search and filter UI
    │   │   ├── SortButton.tsx     # Sort control
    │   │   ├── UserDetails.tsx    # User details panel
    │   │   └── UsersList.tsx      # Users list
    │   ├── hooks/
    │   │   ├── useDebounce.ts     # Debounce hook
    │   │   ├── useUsers.ts        # React Query hooks
    │   │   └── useViewingTimer.ts # Activity timer
    │   ├── lib/
    │   │   └── utils.ts           # Utility functions
    │   ├── types/
    │   │   └── user.ts            # TypeScript types
    │   ├── App.tsx                # Main application
    │   ├── main.tsx               # Entry point
    │   └── index.css              # Tailwind CSS
    ├── package.json               # Frontend dependencies
    ├── tsconfig.json              # TypeScript config
    ├── tsconfig.app.json          # App TypeScript config
    ├── vite.config.ts             # Vite configuration
    └── .gitignore                 # Frontend gitignore
```

## Technologies Used

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ORM**: Prisma
- **Middleware**: CORS

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (custom implementation)
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Key Implementation Details

### 1. Search with Query Cancellation

The search uses debouncing to reduce API calls and React Query's built-in AbortController support to cancel in-flight requests when new searches are initiated.

```typescript
// Debounce search input
const debouncedSearch = useDebounce(search, 300);

// React Query with signal for cancellation
export async function fetchUsers(params, signal) {
  const { data } = await api.get('/users', {
    params,
    signal, // AbortSignal from React Query
  });
  return data;
}
```

### 2. Optimistic Updates

When toggling a user's active status, the UI updates immediately for a snappy experience. If the server request fails, React Query automatically rolls back to the previous state.

```typescript
onMutate: async (userId) => {
  // Cancel outgoing queries
  await queryClient.cancelQueries({ queryKey: ["users"] });

  // Save previous state
  const previousUsers = queryClient.getQueryData(["users"]);

  // Optimistically update
  queryClient.setQueriesData({ queryKey: ["users"] }, (old) =>
    old?.map((user) =>
      user.id === userId ? { ...user, active: !user.active } : user
    )
  );

  return { previousUsers, userId };
},
onError: (err, userId, context) => {
  // Rollback on error
  queryClient.setQueriesData({ queryKey: ["users"] }, context.previousUsers);
}
```

### 3. Sorting

Client-side sorting with disabled button during loading:

```typescript
const sortedUsers = useMemo(() => {
  if (!users || sortDirection === "none") return users;
  return [...users].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortDirection === "asc" ? comparison : -comparison;
  });
}, [users, sortDirection]);

// Disabled during loading/fetching
<SortButton
  disabled={isLoadingUsers || isFetchingUsers}
  direction={sortDirection}
  onChange={setSortDirection}
/>
```

### 4. Activity Timer

Custom hook that tracks viewing time and resets on user change:

```typescript
export function useViewingTimer(userId) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0); // Reset on user change

    if (!userId) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [userId]);

  return seconds;
}
```

## Getting Started

See [QUICKSTART.md](QUICKSTART.md) for quick setup instructions.

See [README.md](README.md) for comprehensive documentation.

## Development Workflow

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Run Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

3. **Run Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

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
# Serve dist folder with any static server
```

## Test the Application

1. **Search**: Type "john" in search box
2. **Filter**: Select "Admin" from role dropdown
3. **Sort**: Click "Sort by Name" button (toggles asc/desc/none)
4. **View Details**: Click on any user in the list
5. **Toggle Status**: Click "Activate User" or "Deactivate User"
6. **Watch Timer**: The viewing timer updates every second

## Bonus Features Implemented

- ✅ Activity indicator showing profile viewing duration
- ✅ Optimistic updates for instant UI feedback
- ✅ Loading skeletons for better perceived performance
- ✅ Disabled sort button during loading
- ✅ Strong TypeScript typing throughout
- ✅ Query cancellation for efficient data fetching

## Future Enhancements

- Add user creation and editing
- Add user deletion with confirmation
- Implement pagination
- Add authentication and authorization
- Add unit and integration tests
- Add Docker configuration
- Deploy to production (Vercel + MongoDB Atlas)

---

**Project Status**: ✅ Complete and Ready to Use

All requirements met, bonus features implemented, and comprehensive documentation provided.
