'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { fetchStatistics } from '@/lib/api'
import { OverallStats } from '@/lib/types'

const DEMO_STATS: OverallStats = {
  total: 425000,
  passed: 382500,
  failed: 42500,
  passPercentage: 90.0,
  totalAPlus: 125000,
  year: 2026,
  districtStats: [
    { _id: 'Ernakulam',          total: 48000, passed: 44160, avgMarks: 490 },
    { _id: 'Thiruvananthapuram', total: 52000, passed: 47320, avgMarks: 480 },
    { _id: 'Thrissur',           total: 42000, passed: 38220, avgMarks: 478 },
    { _id: 'Kozhikode',          total: 45000, passed: 40500, avgMarks: 475 },
    { _id: 'Kannur',             total: 32000, passed: 28800, avgMarks: 472 },
    { _id: 'Kollam',             total: 38000, passed: 33820, avgMarks: 470 },
    { _id: 'Palakkad',           total: 35000, passed: 30800, avgMarks: 465 },
    { _id: 'Malappuram',         total: 40000, passed: 34800, avgMarks: 460 },
  ],
  lastUpdated: new Date().toISOString(),
}

export default function StatsSection() {
  const [stats, setStats] = useState<OverallStats>(DEMO_STATS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetchStatistics()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const cards = [
    { label: 'Total Students',  value: stats.total,          suffix: '',  icon: '👥', accent: 'bg-blue-600',    light: 'bg-blue-50 text-blue-700' },
    { label: 'Students Passed', value: stats.passed,         suffix: '',  icon: '🎓', accent: 'bg-emerald-600', light: 'bg-emerald-50 text-emerald-700' },
    { label: 'Pass Percentage', value: stats.passPercentage, suffix: '%', icon: '📊', accent: 'bg-violet-600',  light: 'bg-violet-50 text-violet-700' },
    { label: 'Total A+ Grades', value: stats.totalAPlus,     suffix: '',  icon: '⭐', accent: 'bg-amber-500',   light: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <section className="bg-slate-50 border-t border-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
            Result Statistics 2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Kerala SSLC 2026 at a Glance
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Overall performance across all 14 districts of Kerala
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.accent} text-white text-xl mb-4`}>
                {card.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mb-0.5">
                {loaded ? (
                  <CountUp
                    end={card.value}
                    duration={2}
                    separator=","
                    decimals={card.suffix === '%' ? 1 : 0}
                    suffix={card.suffix}
                  />
                ) : '—'}
              </p>
              <p className="text-sm text-slate-500 font-medium">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* District breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">District-wise Pass Percentage</h3>
            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              2026 Results
            </span>
          </div>
          <div className="p-6 space-y-4">
            {stats.districtStats.slice(0, 8).map((d, i) => {
              const pct = Math.round((d.passed / d.total) * 100)
              return (
                <motion.div
                  key={d._id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-40 sm:w-48 text-sm font-medium text-slate-700 flex-shrink-0 truncate">
                    {d._id}
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-bold text-blue-600 tabular-nums">
                    {pct}%
                  </div>
                  <div className="hidden sm:block w-24 text-right text-xs text-slate-400 tabular-nums">
                    {d.total.toLocaleString()} students
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
