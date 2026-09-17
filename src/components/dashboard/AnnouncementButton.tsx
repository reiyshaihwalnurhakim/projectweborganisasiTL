'use client'

export default function AnnouncementButton() {
  const handleClick = () => {
    alert("Fitur Manajemen Papan Pengumuman akan tersedia pada pembaruan rilis sistem V2.0 mendatang! (Diluar lingkup MVP saat ini).")
  }

  return (
    <button onClick={handleClick} className="text-sm text-blue-600 font-medium hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
      + Tulis Pengumuman
    </button>
  )
}
