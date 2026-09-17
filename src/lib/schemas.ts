import { z } from 'zod'

export const memberSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  no_telepon: z.string().optional(),
  roleName: z.enum(['admin', 'pengurus', 'anggota']),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(), // Only for create or reset
})

export const activitySchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().min(5, 'Deskripsi minimal 5 karakter'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  startTime: z.string().min(1, 'Jam mulai wajib diisi'),
  endTime: z.string().min(1, 'Jam selesai wajib diisi'),
  location: z.string().min(3, 'Lokasi wajib diisi'),
  personInCharge: z.string().min(3, 'Nama Penanggung Jawab wajib diisi'),
})

export const attendanceSchema = z.object({
  status: z.enum(['HADIR', 'IZIN', 'SAKIT', 'ALPA']),
  note: z.string().optional(),
}).refine(data => {
  if ((data.status === 'IZIN' || data.status === 'SAKIT') && (!data.note || data.note.trim() === '')) {
    return false
  }
  return true
}, {
  message: "Keterangan wajib diisi untuk status IZIN atau SAKIT",
  path: ["note"]
})

export const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.enum(['IURAN', 'DONASI', 'SPONSORSHIP', 'KEGIATAN', 'OPERASIONAL', 'KONSUMSI', 'PERALATAN', 'TRANSPORTASI', 'LAINNYA']),
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  description: z.string().min(3, 'Keterangan terlalu singkat'),
  transactionDate: z.string().min(1, 'Tanggal transaksi wajib diisi'),
})

