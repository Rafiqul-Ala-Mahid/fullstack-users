import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

// CORS configuration - update with your frontend URL after deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL || '*'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true
}));
app.use(express.json());

// Types
interface UsersQueryParams {
  search?: string;
  role?: Role;
}

interface UserParams {
  id: string;
}

// GET /users - List users with search and role filter
app.get('/users', async (req: Request<{}, {}, {}, UsersQueryParams>, res: Response) => {
  try {
    const { search, role } = req.query;

    const where: {
      name?: { contains: string; mode: 'insensitive' };
      role?: Role;
    } = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (role && ['admin', 'editor', 'viewer'].includes(role)) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /users/:id - Get single user
app.get('/users/:id', async (req: Request<UserParams>, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PATCH /users/:id/toggle-active - Toggle user's active status
app.patch('/users/:id/toggle-active', async (req: Request<UserParams>, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { active: !user.active },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Export for Vercel serverless
export default app;
