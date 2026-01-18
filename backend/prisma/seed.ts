import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: Role.admin,
    active: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: Role.viewer,
    active: false,
  },
  {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: Role.editor,
    active: true,
  },
  {
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: Role.admin,
    active: true,
  },
  {
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: Role.viewer,
    active: true,
  },
  {
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    role: Role.editor,
    active: false,
  },
  {
    name: 'Edward Norton',
    email: 'edward.norton@example.com',
    role: Role.viewer,
    active: true,
  },
  {
    name: 'Fiona Green',
    email: 'fiona.green@example.com',
    role: Role.admin,
    active: true,
  },
  {
    name: 'George Lucas',
    email: 'george.lucas@example.com',
    role: Role.editor,
    active: false,
  },
  {
    name: 'Hannah Montana',
    email: 'hannah.montana@example.com',
    role: Role.viewer,
    active: true,
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing users
  await prisma.user.deleteMany();

  // Create new users
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log(`Created ${users.length} users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
