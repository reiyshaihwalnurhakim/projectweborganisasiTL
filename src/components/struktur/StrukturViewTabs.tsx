'use client'

import { useState } from 'react'
import { GitBranch, Shield, Target, Flag } from 'lucide-react'

export default function StrukturViewTabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'struktur' | 'visimisi'>('struktur')

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
        <button
          onClick={() => setActiveTab('struktur')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'struktur'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Bagan Struktur
        </button>
        <button
          onClick={() => setActiveTab('visimisi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'visimisi'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Visi, Misi & Nilai
        </button>
      </div>

      {activeTab === 'struktur' ? (
        children
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visi */}
            <div className="bg-red-700 rounded-2xl p-8 text-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-3 tracking-wide">VISI</h2>
                <p className="text-red-50 leading-relaxed font-medium">
                  "Menjadi wadah pembentukan generasi muda yang disiplin, berkarakter kebangsaan, dan memiliki jiwa kepemimpinan luhur berlandaskan Pancasila."
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 border border-gray-100">
                <Target className="w-6 h-6 text-gray-700" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-gray-900 tracking-wide">MISI</h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-red-700 font-bold mt-0.5">1.</span>
                  <p>Meningkatkan kesadaran berbangsa dan bernegara melalui kedisiplinan dan latihan terstruktur.</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-700 font-bold mt-0.5">2.</span>
                  <p>Membangun mentalitas kepemimpinan yang tangguh, jujur, dan bertanggung jawab.</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-700 font-bold mt-0.5">3.</span>
                  <p>Menyelenggarakan tata kelola organisasi yang transparan dan adaptif terhadap kemajuan teknologi.</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Nilai Dasar */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Flag className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900">Nilai Dasar (Core Values)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Disiplin</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Kepatuhan pada aturan dan ketepatan waktu dalam setiap penugasan.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Loyalitas</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Dedikasi penuh terhadap kehormatan korps dan persaudaraan sesama anggota.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Integritas</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Kejujuran dan ketulusan dalam bertindak, baik di dalam maupun di luar lapangan.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
