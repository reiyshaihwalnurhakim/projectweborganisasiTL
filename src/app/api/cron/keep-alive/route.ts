import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Jalankan query ringan ke database Supabase agar koneksi tetap aktif & timer inaktivitas ter-reset
    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: 'Supabase & Vercel keep-alive ping successful',
      timestamp: new Date().toISOString(),
      totalUsers: userCount
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Database connection error'
      },
      { status: 500 }
    )
  }
}
