# MongoDB Setup Guide

## Quick Setup with MongoDB Atlas (5 Minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email
3. Select **FREE** tier (M0 Sandbox)
4. Choose a cloud provider and region (closest to you)
5. Click "Create Cluster" (takes 1-3 minutes)

### Step 2: Configure Database Access

1. In Atlas dashboard, click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username: `adminuser`
5. Set password: `adminpass123` (or your own secure password)
6. Database User Privileges: Select "Read and write to any database"
7. Click "Add User"

### Step 3: Configure Network Access

1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development only)
4. Confirm

### Step 4: Get Connection String

1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Select "Connect your application"
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://adminuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `/fullstack_users`

   Final string should look like:
   ```
   mongodb+srv://adminuser:adminpass123@cluster0.xxxxx.mongodb.net/fullstack_users?retryWrites=true&w=majority
   ```

### Step 5: Update Backend Configuration

Edit the file: `/Users/macbook/Documents/fullstack-users/backend/.env`

Replace the content with:
```
DATABASE_URL="mongodb+srv://adminuser:adminpass123@cluster0.xxxxx.mongodb.net/fullstack_users?retryWrites=true&w=majority"
PORT=3001
```

(Use your actual connection string from Step 4)

### Step 6: Run Backend Setup

Open a terminal and run:

```bash
cd /Users/macbook/Documents/fullstack-users/backend

# Generate Prisma Client
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && npm run prisma:generate

# Push schema to database
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && npm run prisma:push

# Seed database with sample data
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && npm run seed

# Start backend server
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && npm run dev
```

You should see:
```
Server running on http://localhost:3001
```

### Step 7: Verify Backend is Running

In another terminal:
```bash
curl http://localhost:3001/users
```

You should see JSON response with users.

---

## Alternative: Install MongoDB Locally

If you prefer local MongoDB:

### Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

### Start MongoDB
```bash
brew services start mongodb-community@7.0
```

### Verify MongoDB is Running
```bash
mongosh
```

Then the backend `.env` file should use:
```
DATABASE_URL="mongodb://localhost:27017/fullstack_users"
PORT=3001
```

---

## Troubleshooting

### "Connection refused" error
- Check MongoDB Atlas IP whitelist includes your IP
- Verify connection string is correct
- Check username/password are correct

### "Authentication failed"
- Verify database user credentials in Atlas
- Make sure password has no special characters that need URL encoding

### Prisma errors
- Run `npm run prisma:generate` again
- Delete `node_modules` and run `npm install`

---

## Next Steps

Once backend is running:
1. Keep backend terminal open
2. Open new terminal for frontend
3. Run: `cd /Users/macbook/Documents/fullstack-users/frontend && npm run dev`
4. Visit: http://localhost:5173

Enjoy! 🎉
