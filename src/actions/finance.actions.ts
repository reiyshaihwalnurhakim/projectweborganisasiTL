'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { transactionSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function getFinancialSummary() {
  const transactions = await prisma.transaction.groupBy({
    by: ['type'],
    _sum: {
      amount: true
    }
  })

  let income = 0
  let expense = 0

  transactions.forEach(t => {
    if (t.type === 'INCOME') income = Number(t._sum.amount || 0)
    if (t.type === 'EXPENSE') expense = Number(t._sum.amount || 0)
  })

  return {
    income,
    expense,
    balance: income - expense
  }
}

export async function getTransactions(typeFilter?: string) {
  return await prisma.transaction.findMany({
    where: {
      type: typeFilter && typeFilter !== 'ALL' ? (typeFilter as any) : undefined
    },
    orderBy: { transactionDate: 'desc' },
    include: { creator: { select: { nama: true } } }
  })
}

export async function createTransaction(formData: FormData) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'admin' && session.role !== 'pengurus')) {
      throw new Error('Tidak memiliki akses')
    }

    const data = {
      type: formData.get('type'),
      category: formData.get('category'),
      amount: formData.get('amount'),
      description: formData.get('description'),
      transactionDate: formData.get('transactionDate'),
    }
    
    const parsed = transactionSchema.parse(data)

    await prisma.transaction.create({
      data: {
        type: parsed.type,
        category: parsed.category,
        amount: parsed.amount,
        description: parsed.description,
        transactionDate: new Date(parsed.transactionDate),
        createdBy: session.userId,
      }
    })

    revalidatePath('/dashboard/keuangan')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal menyimpan transaksi' }
  }
}

export async function deleteTransaction(id: string) {
  const session = await getSession()
  if (!session || (session.role !== 'admin' && session.role !== 'pengurus')) {
    throw new Error('Tidak memiliki akses')
  }

  await prisma.transaction.delete({ where: { id } })
  revalidatePath('/dashboard/keuangan')
}
