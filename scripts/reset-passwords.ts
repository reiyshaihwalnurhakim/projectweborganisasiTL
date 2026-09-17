import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Generating hash for "password"...')
  const hashedPassword = await bcrypt.hash('password', 10)

  console.log('Updating all users...')
  const result = await prisma.user.updateMany({
    data: {
      password_hash: hashedPassword
    }
  })

  console.log(`Successfully updated ${result.count} users!`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
