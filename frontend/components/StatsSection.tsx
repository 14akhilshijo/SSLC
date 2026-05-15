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
    { _id: 'Ernakulam', total: 48000, passed: 44000, avgMarks: 490 },
    { _id: 'Kozhikode', total: 45000, passed: 40500, avgMarks: 475 },
    { _id: 'Thrissur', total: 42000, passed: 38000, avgMarks: 478 },
    { _id: 'Kollam', total: 38000, passed: 34000, avgMarks: 470 },
    { _id: 'Palakkad', total: 35000, passed: 31000, avgMarks: 465 },
    { _id: 'Malappuram', total: 40000, passed: 35000, avgMarks: 460 },
    { _id: 'Kannur', total: 32000, passed: 29000, avgMarks: 472 },
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

  const mainStats = [
    { label: 'Total Students', value: stats.total, icon: '👥', suffix: '', color: 'from-blue-500 to-blue-700', glow: 'shadow-blue-500/30' },
    { label: 'Students Passed', value: stats.passed, icon: '🎓', suffix: '', color: 'from-emerald-500 to-green-700', glow: 'shadow-emerald-500/30' },
    { label: 'Pass Percentage', value: stats.passPercentage, icon: '📊', suffix: '%', color: 'from-indigo-500 to-purple-700', glow: 'shadow-indigo-500/30' },
    { label: 'Total A+ Grades', value: stats.totalAPlus, icon: '⭐', suffix: '', color: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/30' },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-4">
            📊 Result Statistics 2026
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            Kerala SSLC 2026 at a Glance
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Overall performance across all 14 districts
          </p>
        </motion.div>

        {/* Main stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {mainStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden bg-gradient-to-br ${stat.color} rounded-3xl p-6 text-white shadow-2xl ${stat.glow} card-glow`}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-black mb-1">
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
                <div className="text-white/80 text-sm font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* District breakdown */}
        {stats.districtStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-white dark:glass-dark rounded-3xl shadow-xl border border-blue-50 dark:border-slate-700 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">District-wise Performance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.districtStats.slice(0, 8).map((d, i) => {
                  const pct = Math.round((d.passed / d.total) * 100)
                  return (
                    <motion.div
                      key={d._id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-32 sm:w-40 text-sm font-medium text-gray-700 dark:text-slate-300 flex-shrink-0">
                        {d._id}
                      </div>
                      <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.05 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        />
                      </div>
                      <div className="w-16 text-right text-sm font-bold text-blue-600 dark:text-blue-400">
                        {pct}%
                      </div>
                      <div className="hidden sm:block w-20 text-right text-xs text-gray-400 dark:text-slate-500">
                        {d.total.toLocaleString()}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
