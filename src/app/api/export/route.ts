import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// Menggunakan metode sederhana untuk ekspor CSV (Tanpa exceljs agar ringan & cepat)
// Di production, bisa menggunakan exceljs atau jspdf sesuai PRD.
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session || (session.role !== 'admin' && session.role !== 'bendahara')) {
    return new NextResponse('Unauthorized', { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'keuangan' atau 'absensi'

  if (type === 'keuangan') {
    const transactions = await prisma.transaction.findMany({
      include: { creator: { select: { nama: true } } },
      orderBy: { transactionDate: 'desc' }
    })

    const csvData = [
      ['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Nominal', 'Dicatat Oleh'],
      ...transactions.map(t => [
        t.transactionDate.toISOString().split('T')[0],
        `"${t.description}"`,
        t.category,
        t.type,
        t.amount.toString(),
        `"${t.creator.nama}"`
      ])
    ].map(e => e.join(',')).join('\n')

    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="Laporan_Keuangan.csv"'
      }
    })
  }

  return new NextResponse('Invalid Type', { status: 400 })
}
