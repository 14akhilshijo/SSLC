'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">School-wise Result 2026</h1>
          <p className="text-gray-500 text-sm mt-1">Enter a school code to view all student results</p>
        </div>

        {/* Search form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
              placeholder="Enter school code (e.g. 12345)"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-lg transition-colors flex-shrink-0"
            >
              {loading
                ? <FiLoader className="animate-spin" size={16} />
                : <><FiSearch size={15} /> Search</>
              }
            </button>
          </form>
        </div>

        {/* Results */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Summary bar */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-gray-500">Total Students</p>
                  <p className="text-xl font-bold text-gray-900">{data.stats.total}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Passed</p>
                  <p className="text-xl font-bold text-green-600">{data.stats.passed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pass %</p>
                  <p className="text-xl font-bold text-blue-600">{data.stats.passPercentage}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">A+ Count</p>
                  <p className="text-xl font-bold text-amber-600">{data.stats.totalAPlus}</p>
                </div>
                <div className="ml-auto self-center text-xs text-gray-400">
                  Page {data.pagination.page} of {data.pagination.pages}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                        <th className="text-left px-4 py-3 font-semibold">#</th>
                        <th className="text-left px-4 py-3 font-semibold">Reg. No.</th>
                        <th className="text-left px-4 py-3 font-semibold">Name</th>
                        <th className="text-center px-4 py-3 font-semibold">Marks</th>
                        <th className="text-center px-4 py-3 font-semibold">%</th>
                        <th className="text-center px-4 py-3 font-semibold">Grade</th>
                        <th className="text-center px-4 py-3 font-semibold">A+</th>
                        <th className="text-center px-4 py-3 font-semibold">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.results.map((student, idx) => (
                        <tr key={student.registerNumber} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                            {(data.pagination.page - 1) * 20 + idx + 1}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600">
                            {student.registerNumber}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {student.studentName}
                          </td>
                          <td className="text-center px-4 py-3 font-bold text-gray-900">
                            {student.totalMarks}
                          </td>
                          <td className="text-center px-4 py-3 text-gray-600">
                            {student.percentage}%
                          </td>
                          <td className="text-center px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(student.grade)}`}>
                              {student.grade}
                            </span>
                          </td>
                          <td className="text-center px-4 py-3 text-amber-500 font-bold text-xs">
                            {student.aPlusCount > 0 ? student.aPlusCount : '—'}
                          </td>
                          <td className="text-center px-4 py-3">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              student.result === 'PASS'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
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
                  <div className="flex items-center justify-center gap-1.5 px-4 py-3 border-t border-gray-100">
                    <button
                      onClick={() => changePage(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    >
                      <FiChevronLeft size={15} />
                    </button>
                    {Array.from({ length: Math.min(data.pagination.pages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => changePage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                          p === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => changePage(page + 1)}
                      disabled={page === data.pagination.pages}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors"
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
