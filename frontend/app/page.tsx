'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import SearchSection from '@/components/SearchSection'
import StatsSection from '@/components/StatsSection'
import ResultCard from '@/components/ResultCard'
import SchoolResultSection from '@/components/SchoolResultSection'
import Footer from '@/components/Footer'
import LiveCounter from '@/components/LiveCounter'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import { ResultData } from '@/lib/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'individual' | 'school'>('individual')
  const [result, setResult] = useState<ResultData | null>(null)
  const [schoolCode, setSchoolCode] = useState('')

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <AnnouncementBanner />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <HeroBanner />
      <LiveCounter />

      <div id="search" className="relative z-10 -mt-8">
        {activeTab === 'individual' ? (
          <SearchSection onResult={setResult} />
        ) : (
          <SchoolResultSection />
        )}
      </div>

      {result && activeTab === 'individual' && (
        <ResultCard result={result} onClose={() => setResult(null)} />
      )}

      <StatsSection />
      <Footer />
    </main>
  )
}
