import { hash } from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash('Admin@123', 10);
  const protectorPassword = await hash('Protetor@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@sosbichosolto.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@sosbichosolto.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'protetor@sosbichosolto.com' },
    update: {},
    create: {
      name: 'Protetor',
      email: 'protetor@sosbichosolto.com',
      password: protectorPassword,
      role: UserRole.PROTETOR,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
