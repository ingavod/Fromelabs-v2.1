// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@fromelabs.com';
  const password = 'Admin123!'; // Cambia esto después del primer login
  const name = 'Administrador';

  // Verificar si ya existe
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('❌ El usuario admin ya existe');
    return;
  }

  // Hashear la contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuario admin creado exitosamente');
  console.log('📧 Email:', email);
  console.log('🔑 Contraseña:', password);
  console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
