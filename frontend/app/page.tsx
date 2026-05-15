'use client'
import { useState } from 'react'
import SearchSection from '@/components/SearchSection'
import ResultCard from '@/components/ResultCard'
import SchoolResultSection from '@/components/SchoolResultSection'
import Footer from '@/components/Footer'
import { ResultData } from '@/lib/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'individual' | 'school'>('individual')
  const [result, setResult] = useState<ResultData | null>(null)

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Minimal top bar */}
      <div className="bg-blue-700 text-white px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">Kerala Pareeksha Bhavan</p>
            <p className="text-blue-200 text-xs">SSLC Result 2026</p>
          </div>
          <div className="flex gap-1 bg-blue-800/60 rounded-lg p-1">
            {(['individual', 'school'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setResult(null) }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-700'
                    : 'text-blue-100 hover:bg-blue-600/50'
                }`}
              >
                {tab === 'individual' ? 'Individual' : 'School'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1">
        {activeTab === 'individual' ? (
          <>
            <SearchSection onResult={(r) => { setResult(r) }} />
            {result && (
              <ResultCard result={result} onClose={() => setResult(null)} />
            )}
          </>
        ) : (
          <SchoolResultSection />
        )}
      </main>

      <Footer />
    </div>
  )
}
