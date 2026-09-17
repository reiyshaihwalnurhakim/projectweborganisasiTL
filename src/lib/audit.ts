import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

interface AuditLogParams {
  action: string
  entity: string
  entityId?: string
  details?: any
}

export async function createAuditLog({ action, entity, entityId, details }: AuditLogParams) {
  try {
    const session = await getSession()
    // Jalankan secara asinkron (non-blocking) agar tidak memperlambat request utama
    prisma.auditLog.create({
      data: {
        userId: session?.userId || null,
        action,
        entity,
        entityId,
        details: details ? JSON.stringify(details) : null,
        // IP Address dan User Agent seharusnya diambil dari middleware/headers, 
        // tapi disederhanakan untuk contoh ini
      }
    }).catch(console.error)
  } catch (e) {
    console.error('Failed to create audit log', e)
  }
}
