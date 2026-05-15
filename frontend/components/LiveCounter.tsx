'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'

export default function LiveCounter() {
  const [count, setCount] = useState(142857)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 5) + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-sm border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-white/80">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-medium">Live Traffic:</span>
          <span className="text-green-400 font-bold">
            <CountUp end={count} duration={2} separator="," />
          </span>
          <span>results checked today</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-white/60">
          <span>🔄</span>
          <span>Auto-refreshing every 30s</span>
        </div>
      </div>
    </motion.div>
  )
}
