'use client'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

export default function LiveCounter() {
  const [count, setCount] = useState(142857)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 4) + 1)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-6 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
          <span>Results checked today:</span>
          <span className="text-green-400 font-bold tabular-nums">
            <CountUp end={count} duration={2} separator="," />
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
          <span>🔄</span>
          <span>Auto-refreshing</span>
        </div>
      </div>
    </div>
  )
}
