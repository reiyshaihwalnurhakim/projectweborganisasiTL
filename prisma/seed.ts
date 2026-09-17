import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Menjalankan seeding data...')

  // 1. Buat Roles
  const adminRole = await prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin', description: 'Administrator' } })
  const pengurusRole = await prisma.role.upsert({ where: { name: 'pengurus' }, update: {}, create: { name: 'pengurus', description: 'Pengurus' } })
  const anggotaRole = await prisma.role.upsert({ where: { name: 'anggota' }, update: {}, create: { name: 'anggota', description: 'Anggota Biasa' } })

  console.log('Roles berhasil dibuat.')

  // 2. Buat Akun Users
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password_hash: hashedPassword, nama: 'Administrator Utama', email: 'admin@organisasi.com', status: 'active', roleId: adminRole.id },
  })

  const user2 = await prisma.user.upsert({
    where: { username: 'johndoe' },
    update: {},
    create: { username: 'johndoe', password_hash: hashedPassword, nama: 'John Doe', email: 'john@example.com', status: 'active', roleId: pengurusRole.id },
  })

  const user3 = await prisma.user.upsert({
    where: { username: 'janedoe' },
    update: {},
    create: { username: 'janedoe', password_hash: hashedPassword, nama: 'Jane Doe', email: 'jane@example.com', status: 'active', roleId: pengurusRole.id },
  })

  console.log('Akun berhasil dibuat.')

  // 3. Buat Struktur Jabatan (Hierarchy)
  // Bersihkan tabel posisi dan pivot
  await prisma.organizationMember.deleteMany()
  await prisma.position.deleteMany()

  const ketua = await prisma.position.create({
    data: { name: 'Ketua Umum', order: 1 }
  })

  const sekretaris = await prisma.position.create({
    data: { name: 'Sekretaris Umum', order: 2, parentId: ketua.id }
  })

  const bendahara = await prisma.position.create({
    data: { name: 'Bendahara Umum', order: 3, parentId: ketua.id }
  })

  const divAcara = await prisma.position.create({
    data: { name: 'Koordinator Divisi Acara', order: 4, parentId: ketua.id }
  })

  // 4. Assign Anggota ke Jabatan
  const period = '2026/2027'

  await prisma.organizationMember.create({
    data: { userId: adminUser.id, positionId: ketua.id, period, isCurrent: true }
  })

  await prisma.organizationMember.create({
    data: { userId: user2.id, positionId: sekretaris.id, period, isCurrent: true }
  })

  await prisma.organizationMember.create({
    data: { userId: user3.id, positionId: divAcara.id, period, isCurrent: true }
  })

  console.log('Struktur Organisasi berhasil dibuat.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
