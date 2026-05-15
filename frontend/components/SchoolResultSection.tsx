'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
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
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">School-wise Result</h2>
            <p className="text-slate-500 text-sm mt-1.5">Enter a school code to view all student results</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                  placeholder="School Code (e.g. 12345)"
                  className="field-input pl-10 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-blue px-5 flex-shrink-0"
              >
                {loading
                  ? <FiLoader className="animate-spin" size={16} />
                  : <><FiSearch size={15} /> Search</>
                }
              </button>
            </form>
          </motion.div>
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
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Students', value: data.stats.total,                    accent: 'bg-blue-600' },
                  { label: 'Passed',         value: data.stats.passed,                   accent: 'bg-emerald-600' },
                  { label: 'Pass %',         value: `${data.stats.passPercentage}%`,     accent: 'bg-violet-600' },
                  { label: 'Total A+',       value: data.stats.totalAPlus,               accent: 'bg-amber-500' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                    <div className={`w-2 h-2 rounded-full ${s.accent} mb-3`} />
                    <p className="text-2xl font-black text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">School {schoolCode} — Student Results</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{data.pagination.total} students found</p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                    Page {data.pagination.page} / {data.pagination.pages}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Reg. No.</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Student Name</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Marks</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">%</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Grade</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">A+</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.results.map((student, idx) => (
                        <tr
                          key={student.registerNumber}
                          className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors ${
                            idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                          }`}
                        >
                          <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                            {(data.pagination.page - 1) * 20 + idx + 1}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-500">
                            {student.registerNumber}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {student.studentName}
                          </td>
                          <td className="text-center px-4 py-3 font-bold text-slate-900">
                            {student.totalMarks}
                          </td>
                          <td className="text-center px-4 py-3 text-slate-500">
                            {student.percentage}%
                          </td>
                          <td className="text-center px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${getGradeColor(student.grade)}`}>
                              {student.grade}
                            </span>
                          </td>
                          <td className="text-center px-4 py-3">
                            {student.aPlusCount > 0 && (
                              <span className="text-amber-500 font-bold text-xs">★ {student.aPlusCount}</span>
                            )}
                          </td>
                          <td className="text-center px-4 py-3">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              student.result === 'PASS'
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                            }`}>
                              {student.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {data.pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 px-5 py-4 border-t border-slate-100">
                    <button
                      onClick={() => changePage(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                    >
                      <FiChevronLeft size={15} />
                    </button>
                    {Array.from({ length: Math.min(data.pagination.pages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => changePage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                          p === page
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => changePage(page + 1)}
                      disabled={page === data.pagination.pages}
                      className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                    >
                      <FiChevronRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
