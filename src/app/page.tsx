import { redirect } from 'next/navigation'

export default function Home() {
  // Arahkan pengunjung halaman utama langsung ke sistem aplikasi
  redirect('/dashboard')
}
