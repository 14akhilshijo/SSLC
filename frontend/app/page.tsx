'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import SearchSection from '@/components/SearchSection'
import ResultCard from '@/components/ResultCard'
import SchoolResultSection from '@/components/SchoolResultSection'
import StatsSection from '@/components/StatsSection'
import Footer from '@/components/Footer'
import { ResultData } from '@/lib/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'individual' | 'school'>('individual')
  const [result, setResult] = useState<ResultData | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

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

      <StatsSection />
      <Footer />
    </div>
  )
}
