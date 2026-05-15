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
    { _id: 'Thiruvananthapuram', total: 52000, passed: 47000, avgMarks: 480 },
    { _id: 'Ernakulam',          total: 48000, passed: 44000, avgMarks: 490 },
    { _id: 'Kozhikode',          total: 45000, passed: 40500, avgMarks: 475 },
    { _id: 'Thrissur',           total: 42000, passed: 38000, avgMarks: 478 },
    { _id: 'Kollam',             total: 38000, passed: 34000, avgMarks: 470 },
    { _id: 'Palakkad',           total: 35000, passed: 31000, avgMarks: 465 },
    { _id: 'Malappuram',         total: 40000, passed: 35000, avgMarks: 460 },
    { _id: 'Kannur',             total: 32000, passed: 29000, avgMarks: 472 },
  ],
  lastUpdated: new Date().toISOString(),
}

const STAT_CARDS = (s: OverallStats) => [
  { label: 'Total Students',  value: s.total,           suffix: '',  icon: '👥', from: 'from-blue-500',    to: 'to-blue-700',    glow: 'shadow-blue-500/25' },
  { label: 'Students Passed', value: s.passed,          suffix: '',  icon: '🎓', from: 'from-emerald-500', to: 'to-green-700',   glow: 'shadow-emerald-500/25' },
  { label: 'Pass Percentage', value: s.passPercentage,  suffix: '%', icon: '📊', from: 'from-indigo-500',  to: 'to-purple-700',  glow: 'shadow-indigo-500/25' },
  { label: 'Total A+ Grades', value: s.totalAPlus,      suffix: '',  icon: '⭐', from: 'from-amber-500',   to: 'to-orange-600',  glow: 'shadow-amber-500/25' },
]

export default function StatsSection() {
  const [stats, setStats] = useState<OverallStats>(DEMO_STATS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetchStatistics()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-3">
            📊 Result Statistics 2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Kerala SSLC 2026 at a Glance
          </h2>
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-1.5">
            Overall performance across all 14 districts
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STAT_CARDS(stats).map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`stat-card bg-gradient-to-br ${stat.from} ${stat.to} shadow-xl ${stat.glow} card-hover`}
            >
              <div className="absolute -top-3 -right-3 w-20 h-20 bg-white/8 rounded-full" />
              <div className="relative z-10">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-black mb-0.5">
                  {loaded ? (
                    <CountUp
                      end={stat.value}
                      duration={2}
                      separator=","
                      decimals={stat.suffix === '%' ? 1 : 0}
                      suffix={stat.suffix}
                    />
                  ) : '—'}
                </div>
                <div className="text-white/75 text-xs font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* District breakdown */}
        {stats.districtStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-md shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">District-wise Performance</h3>
              <span className="text-xs text-slate-400">Pass %</span>
            </div>
            <div className="p-6 space-y-3.5">
              {stats.districtStats.slice(0, 8).map((d, i) => {
                const pct = Math.round((d.passed / d.total) * 100)
                return (
                  <motion.div
                    key={d._id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-36 sm:w-44 text-xs font-medium text-gray-600 dark:text-slate-400 flex-shrink-0 truncate">
                      {d._id}
                    </div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: i * 0.05, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      />
                    </div>
                    <div className="w-12 text-right text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      {pct}%
                    </div>
                    <div className="hidden sm:block w-20 text-right text-xs text-slate-400 tabular-nums">
                      {d.total.toLocaleString()}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
