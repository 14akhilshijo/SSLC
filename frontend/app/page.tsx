'use client'
import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import toast from 'react-hot-toast'
import { fetchIndividualResult, fetchSchoolResults, downloadPDF } from '@/lib/api'
import { ResultData, SchoolData } from '@/lib/types'
import { formatDate, getWhatsAppShareUrl } from '@/lib/utils'

export default function Home() {
  const [regno, setRegno] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultData | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const [schoolCode, setSchoolCode] = useState('')
  const [schoolLoading, setSchoolLoading] = useState(false)
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)
  const [schoolPage, setSchoolPage] = useState(1)

  const handleIndividual = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regno.trim()) return toast.error('Enter your register number')
    if (!dob) return toast.error('Enter your date of birth')
    setLoading(true)
    setResult(null)
    try {
      const r = await fetchIndividualResult(regno.trim().toUpperCase(), dob)
      setResult(r)
      setTimeout(() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err: any) {
      toast.error(err.message || 'Result not found. Check your details.')
    } finally {
      setLoading(false)
    }
  }

  const handleSchool = async (e: React.FormEvent | null, p = 1) => {
    e?.preventDefault()
    if (!schoolCode.trim()) return toast.error('Enter a school code')
    setSchoolLoading(true)
    try {
      const r = await fetchSchoolResults(schoolCode.trim(), p, 20)
      setSchoolData(r)
      setSchoolPage(p)
      setTimeout(() => document.getElementById('school-results')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err: any) {
      toast.error(err.message || 'School not found')
    } finally {
      setSchoolLoading(false)
    }
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `SSLC_${result?.registerNumber}_2026`,
  })

  const handlePDF = () => {
    if (!result) return
    toast.loading('Generating PDF...')
    downloadPDF(result.registerNumber, result.dateOfBirth)
    setTimeout(() => toast.dismiss(), 2000)
  }

  const isPassed = result?.result === 'PASS'

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-bold text-gray-900">Kerala SSLC Result 2026</h1>
          <p className="text-sm text-gray-500">Kerala Pareeksha Bhavan</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* Individual Result Search */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-4">Check Your Result</h2>
          <form onSubmit={handleIndividual} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Register Number</label>
              <input
                type="text"
                value={regno}
                onChange={e => setRegno(e.target.value.toUpperCase())}
                placeholder="e.g. 1234567"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                maxLength={20}
                autoComplete="off"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                max="2015-12-31"
                min="2005-01-01"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white text-sm font-medium rounded transition-colors"
            >
              {loading ? 'Loading...' : 'Get Result'}
            </button>
          </form>
        </section>

        {/* Result Card */}
        {result && (
          <section id="result" ref={printRef}>
            <div className="border border-gray-200 rounded">

              {/* Pass/Fail bar */}
              <div className={`h-1 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} />

              {/* Student info */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900 text-base">{result.studentName}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Reg: {result.registerNumber}</p>
                    <p className="text-sm text-gray-500">{result.schoolName}</p>
                    <p className="text-sm text-gray-500">{result.district}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-bold ${
                      isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {result.result}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Grade: <strong>{result.grade}</strong></p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 text-center">
                <div className="py-3">
                  <p className="text-base font-bold text-gray-900">{result.totalMarks}/{result.maxMarks}</p>
                  <p className="text-xs text-gray-500">Total Marks</p>
                </div>
                <div className="py-3">
                  <p className="text-base font-bold text-gray-900">{result.percentage}%</p>
                  <p className="text-xs text-gray-500">Percentage</p>
                </div>
                <div className="py-3">
                  <p className="text-base font-bold text-gray-900">{result.aPlusCount}</p>
                  <p className="text-xs text-gray-500">A+ Subjects</p>
                </div>
              </div>

              {/* Subjects */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                    <th className="text-left px-4 py-2">Subject</th>
                    <th className="text-center px-3 py-2">Theory</th>
                    <th className="text-center px-3 py-2">Practical</th>
                    <th className="text-center px-3 py-2">Total</th>
                    <th className="text-center px-3 py-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((sub) => (
                    <tr key={sub.code} className="border-b border-gray-50">
                      <td className="px-4 py-2 text-gray-800">{sub.name}</td>
                      <td className="text-center px-3 py-2 text-gray-600">{sub.theory}</td>
                      <td className="text-center px-3 py-2 text-gray-600">{sub.practical || '—'}</td>
                      <td className="text-center px-3 py-2 font-medium text-gray-900">{sub.total}</td>
                      <td className="text-center px-3 py-2 text-gray-700 font-medium">{sub.grade}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200 font-semibold">
                    <td className="px-4 py-2 text-gray-900">TOTAL</td>
                    <td colSpan={2} />
                    <td className="text-center px-3 py-2 text-gray-900">{result.totalMarks}</td>
                    <td className="text-center px-3 py-2 text-gray-900">{result.grade}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Actions */}
              <div className="flex gap-2 p-3 border-t border-gray-100 no-print">
                <button
                  onClick={() => window.open(getWhatsAppShareUrl(result.registerNumber, result.studentName, result.result, result.grade), '_blank')}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                >
                  Share
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                >
                  Print
                </button>
                <button
                  onClick={handlePDF}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-700 ml-auto"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>
        )}

        {/* School Result Search */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-4">School-wise Result</h2>
          <form onSubmit={handleSchool} className="flex gap-2">
            <input
              type="text"
              value={schoolCode}
              onChange={e => setSchoolCode(e.target.value.toUpperCase())}
              placeholder="School code (e.g. 12345)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
            />
            <button
              type="submit"
              disabled={schoolLoading}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white text-sm font-medium rounded transition-colors"
            >
              {schoolLoading ? '...' : 'Search'}
            </button>
          </form>
        </section>

        {/* School Results Table */}
        {schoolData && (
          <section id="school-results">
            {/* Stats */}
            <div className="flex gap-6 mb-3 text-sm text-gray-600">
              <span>Total: <strong className="text-gray-900">{schoolData.stats.total}</strong></span>
              <span>Passed: <strong className="text-green-700">{schoolData.stats.passed}</strong></span>
              <span>Pass %: <strong className="text-gray-900">{schoolData.stats.passPercentage}%</strong></span>
              <span className="ml-auto text-gray-400 text-xs">Page {schoolData.pagination.page}/{schoolData.pagination.pages}</span>
            </div>

            <div className="border border-gray-200 rounded overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
                    <th className="text-left px-3 py-2">#</th>
                    <th className="text-left px-3 py-2">Reg. No.</th>
                    <th className="text-left px-3 py-2">Name</th>
                    <th className="text-center px-3 py-2">Marks</th>
                    <th className="text-center px-3 py-2">%</th>
                    <th className="text-center px-3 py-2">Grade</th>
                    <th className="text-center px-3 py-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolData.results.map((s, i) => (
                    <tr key={s.registerNumber} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-400 text-xs">{(schoolData.pagination.page - 1) * 20 + i + 1}</td>
                      <td className="px-3 py-2 font-mono text-xs text-gray-500">{s.registerNumber}</td>
                      <td className="px-3 py-2 text-gray-900">{s.studentName}</td>
                      <td className="text-center px-3 py-2 text-gray-900">{s.totalMarks}</td>
                      <td className="text-center px-3 py-2 text-gray-600">{s.percentage}%</td>
                      <td className="text-center px-3 py-2 text-gray-700 font-medium">{s.grade}</td>
                      <td className="text-center px-3 py-2">
                        <span className={`text-xs font-medium ${s.result === 'PASS' ? 'text-green-700' : 'text-red-600'}`}>
                          {s.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {schoolData.pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-3">
                <button
                  onClick={() => handleSchool(null, schoolPage - 1)}
                  disabled={schoolPage === 1}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(schoolData.pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handleSchool(null, p)}
                    className={`w-8 h-8 text-xs rounded border ${
                      p === schoolPage ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => handleSchool(null, schoolPage + 1)}
                  disabled={schoolPage === schoolData.pagination.pages}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 px-4 py-5 text-center text-xs text-gray-400">
        <p>Kerala Pareeksha Bhavan — SSLC Result Portal 2026</p>
        <p className="mt-1">© 2026 Kerala Pareeksha Bhavan. All rights reserved.</p>
      </footer>

    </div>
  )
}
