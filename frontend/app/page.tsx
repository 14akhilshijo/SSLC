'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import SearchSection from '@/components/SearchSection'
import StatsSection from '@/components/StatsSection'
import ResultCard from '@/components/ResultCard'
import SchoolResultSection from '@/components/SchoolResultSection'
import Footer from '@/components/Footer'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import { ResultData } from '@/lib/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'individual' | 'school'>('individual')
  const [result, setResult] = useState<ResultData | null>(null)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBanner />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <HeroBanner activeTab={activeTab} setActiveTab={setActiveTab} />

      <main id="search" className="flex-1 bg-white">
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
