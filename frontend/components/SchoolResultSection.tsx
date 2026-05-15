'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiLoader, FiChevronLeft, FiChevronRight, FiDownload, FiAward } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchSchoolResults } from '@/lib/api'
import { SchoolData } from '@/lib/types'
import { getGradeColor } from '@/lib/utils'

export default function SchoolResultSection() {
  const [schoolCode, setSchoolCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SchoolData | null>(null)
  const [page, setPage] = useState(1)

  const handleSearch = async (e: React.FormEvent, p = 1) => {
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
    handleSearch(null as any, p)
    document.getElementById('school-results')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        {/* Search card */}
        <div className="max-w-2xl mx-auto glass-white dark:glass-dark rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-blue-100 dark:border-slate-700 mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
              <span className="text-2xl">🏫</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">School-wise Result</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Enter school code to view all results</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
              <input
                type="text"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                placeholder="Enter School Code (e.g. 12345)"
                className="input-kerala pl-11 font-mono"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-6"
            >
              {loading ? <FiLoader className="animate-spin" size={20} /> : <FiSearch size={20} />}
            </motion.button>
          </form>
        </div>

        {/* Results */}
        <AnimatePresence>
          {data && (
            <motion.div
              id="school-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Students', value: data.stats.total, icon: '👥', color: 'from-blue-500 to-blue-600' },
                  { label: 'Passed', value: data.stats.passed, icon: '✅', color: 'from-emerald-500 to-green-600' },
                  { label: 'Pass %', value: `${data.stats.passPercentage}%`, icon: '📊', color: 'from-indigo-500 to-purple-600' },
                  { label: 'Total A+', value: data.stats.totalAPlus, icon: '⭐', color: 'from-amber-500 to-orange-600' },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg`}
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-black">{stat.value}</div>
                    <div className="text-white/80 text-xs font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Table */}
              <div className="glass-white dark:glass-dark rounded-3xl shadow-xl border border-blue-50 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiAward className="text-blue-500" />
                    Student Results — School {schoolCode}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    Page {data.pagination.page} of {data.pagination.pages}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <th className="text-left px-4 py-3 font-semibold">#</th>
                        <th className="text-left px-4 py-3 font-semibold">Reg. No.</th>
                        <th className="text-left px-4 py-3 font-semibold">Student Name</th>
                        <th className="text-center px-4 py-3 font-semibold">Marks</th>
                        <th className="text-center px-4 py-3 font-semibold">%</th>
                        <th className="text-center px-4 py-3 font-semibold">Grade</th>
                        <th className="text-center px-4 py-3 font-semibold">A+</th>
                        <th className="text-center px-4 py-3 font-semibold">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.results.map((student, idx) => (
                        <motion.tr
                          key={student.registerNumber}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`border-b border-gray-50 dark:border-slate-700 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors ${
                            idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50/30 dark:bg-slate-800/50'
                          }`}
                        >
                          <td className="px-4 py-3 text-gray-400 dark:text-slate-500 font-mono text-xs">
                            {(data.pagination.page - 1) * 20 + idx + 1}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-slate-400">
                            {student.registerNumber}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {student.studentName}
                          </td>
                          <td className="text-center px-4 py-3 font-bold text-gray-900 dark:text-white">
                            {student.totalMarks}
                          </td>
                          <td className="text-center px-4 py-3 text-gray-600 dark:text-slate-400">
                            {student.percentage}%
                          </td>
                          <td className="text-center px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${getGradeColor(student.grade)}`}>
                              {student.grade}
                            </span>
                          </td>
                          <td className="text-center px-4 py-3">
                            {student.aPlusCount > 0 && (
                              <span className="text-amber-500 font-bold text-xs">⭐ {student.aPlusCount}</span>
                            )}
                          </td>
                          <td className="text-center px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
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
                  <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-100 dark:border-slate-700">
                    <button
                      onClick={() => changePage(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 disabled:opacity-40 hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <FiChevronLeft size={18} />
                    </button>
                    {Array.from({ length: Math.min(data.pagination.pages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => changePage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                          p === page
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-slate-600'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => changePage(page + 1)}
                      disabled={page === data.pagination.pages}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 disabled:opacity-40 hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <FiChevronRight size={18} />
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
