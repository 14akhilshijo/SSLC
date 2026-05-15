'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiLoader, FiChevronLeft, FiChevronRight, FiAward } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchSchoolResults } from '@/lib/api'
import { SchoolData } from '@/lib/types'
import { getGradeColor } from '@/lib/utils'

export default function SchoolResultSection() {
  const [schoolCode, setSchoolCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SchoolData | null>(null)
  const [page, setPage] = useState(1)

  const handleSearch = async (e: React.FormEvent | null, p = 1) => {
    e?.preventDefault()
    if (!schoolCode.trim()) return toast.error('Please enter a school code')
    setLoading(true)
    try {
      const result = await fetchSchoolResults(schoolCode.trim(), p, 20)
      setData(result)
      setPage(p)
    } catch (err: any) {
      toast.error(err.message || 'School not found')
    } finally {
      setLoading(false)
    }
  }

  const changePage = (p: number) => {
    handleSearch(null, p)
    document.getElementById('school-results')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

        {/* Search card */}
        <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 overflow-hidden mb-8">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />
          <div className="p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/25 flex-shrink-0">
                <span className="text-xl">🏫</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">School-wise Result</h2>
                <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">Enter school code to view all results</p>
              </div>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2.5">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                  placeholder="School Code (e.g. 12345)"
                  className="input-kerala pl-10 font-mono text-sm"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-5"
              >
                {loading ? <FiLoader className="animate-spin" size={16} /> : <FiSearch size={16} />}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {data && (
            <motion.div
              id="school-results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Total Students', value: data.stats.total,           icon: '👥', from: 'from-blue-500',    to: 'to-blue-700' },
                  { label: 'Passed',         value: data.stats.passed,          icon: '✅', from: 'from-emerald-500', to: 'to-green-700' },
                  { label: 'Pass %',         value: `${data.stats.passPercentage}%`, icon: '📊', from: 'from-indigo-500', to: 'to-purple-700' },
                  { label: 'Total A+',       value: data.stats.totalAPlus,      icon: '⭐', from: 'from-amber-500',   to: 'to-orange-600' },
                ].map((stat) => (
                  <div key={stat.label} className={`stat-card bg-gradient-to-br ${stat.from} ${stat.to} shadow-lg`}>
                    <div className="text-xl mb-1">{stat.icon}</div>
                    <div className="text-xl font-black">{stat.value}</div>
                    <div className="text-white/75 text-xs font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                    <FiAward className="text-blue-500" size={14} />
                    School {schoolCode} — Student Results
                  </h3>
                  <span className="text-xs text-slate-400">
                    Page {data.pagination.page} / {data.pagination.pages}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 text-xs border-b border-slate-100 dark:border-slate-700/60">
                        <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">#</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Reg. No.</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Student Name</th>
                        <th className="text-center px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Marks</th>
                        <th className="text-center px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">%</th>
                        <th className="text-center px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Grade</th>
                        <th className="text-center px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">A+</th>
                        <th className="text-center px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40">
                      {data.results.map((student, idx) => (
                        <motion.tr
                          key={student.registerNumber}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.025 }}
                          className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <td className="px-4 py-2.5 text-slate-400 font-mono text-xs">
                            {(data.pagination.page - 1) * 20 + idx + 1}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                            {student.registerNumber}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white text-sm">
                            {student.studentName}
                          </td>
                          <td className="text-center px-4 py-2.5 font-bold text-gray-900 dark:text-white text-sm">
                            {student.totalMarks}
                          </td>
                          <td className="text-center px-4 py-2.5 text-slate-500 dark:text-slate-400 text-sm">
                            {student.percentage}%
                          </td>
                          <td className="text-center px-4 py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${getGradeColor(student.grade)}`}>
                              {student.grade}
                            </span>
                          </td>
                          <td className="text-center px-4 py-2.5">
                            {student.aPlusCount > 0 && (
                              <span className="text-amber-500 font-bold text-xs">⭐ {student.aPlusCount}</span>
                            )}
                          </td>
                          <td className="text-center px-4 py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              student.result === 'PASS'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {student.result}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {data.pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => changePage(page - 1)}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 disabled:opacity-30 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <FiChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(data.pagination.pages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => changePage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                          p === page
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-blue-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => changePage(page + 1)}
                      disabled={page === data.pagination.pages}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 disabled:opacity-30 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
