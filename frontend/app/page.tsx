'use client'
import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { QRCodeSVG } from 'qrcode.react'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import CountUp from 'react-countup'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiLoader, FiSearch, FiDownload, FiPrinter,
  FiShare2, FiChevronLeft, FiChevronRight, FiRefreshCw
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { fetchIndividualResult, fetchSchoolResults, downloadPDF } from '@/lib/api'
import { ResultData, SchoolData } from '@/lib/types'
import { getGradeColor, getGradeBg, formatDate, getWhatsAppShareUrl } from '@/lib/utils'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

/* ─── colour tokens (green theme) ─── */
const C = {
  primary:   'bg-green-600',
  primaryHov:'hover:bg-green-700',
  primaryDis:'disabled:bg-green-300',
  ring:      'focus:ring-green-500',
  border:    'focus:border-green-500',
  text:      'text-green-700',
  light:     'bg-green-50',
  bar:       'bg-green-600',
}

export default function Home() {
  /* individual */
  const [regno, setRegno]   = useState('')
  const [dob, setDob]       = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultData | null>(null)
  const [confetti, setConfetti] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  /* school */
  const [schoolCode, setSchoolCode] = useState('')
  const [schoolLoading, setSchoolLoading] = useState(false)
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)
  const [schoolPage, setSchoolPage] = useState(1)

  /* ── handlers ── */
  const handleIndividual = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regno.trim()) return toast.error('Enter your register number')
    if (!dob)          return toast.error('Enter your date of birth')
    setLoading(true)
    setResult(null)
    try {
      const r = await fetchIndividualResult(regno.trim().toUpperCase(), dob)
      setResult(r)
      if (r.result === 'PASS') setConfetti(true)
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

  const handleShare = () => {
    if (!result) return
    window.open(getWhatsAppShareUrl(result.registerNumber, result.studentName, result.result, result.grade), '_blank')
  }

  const handlePDF = () => {
    if (!result) return
    toast.loading('Generating PDF...')
    downloadPDF(result.registerNumber, result.dateOfBirth)
    setTimeout(() => toast.dismiss(), 2000)
  }

  const isPassed = result?.result === 'PASS'

  return (
    <div className="min-h-screen bg-gray-50">
      {confetti && (
        <Confetti recycle={false} numberOfPieces={200}
          onConfettiComplete={() => setConfetti(false)}
          colors={['#16a34a','#22c55e','#4ade80','#fbbf24','#f59e0b']} />
      )}

      {/* ── HEADER ── */}
      <header className="bg-green-700 text-white px-4 py-3 shadow">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-bold text-sm leading-tight">Kerala Pareeksha Bhavan</p>
            <p className="text-green-200 text-xs">SSLC Result Portal 2026</p>
          </div>
          <span className="flex items-center gap-1.5 bg-green-800/60 px-3 py-1 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
            Results Live
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* ══════════════════════════════════════
            SECTION 1 — Individual Result Search
        ══════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <h2 className="text-white font-bold text-base">Check Individual Result</h2>
            <p className="text-green-100 text-xs mt-0.5">Enter your register number and date of birth</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleIndividual} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Register Number
                  </label>
                  <input
                    type="text"
                    value={regno}
                    onChange={e => setRegno(e.target.value.toUpperCase())}
                    placeholder="e.g. 1234567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    maxLength={20}
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    max="2015-12-31"
                    min="2005-01-01"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading
                  ? <><FiLoader className="animate-spin" size={16} /> Getting Result...</>
                  : 'Get Result'
                }
              </button>
            </form>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 2 — Individual Result Card
        ══════════════════════════════════════ */}
        <AnimatePresence>
          {result && (
            <motion.section
              id="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Action bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 no-print">
                <p className="text-sm font-bold text-gray-800">Result Card</p>
                <div className="flex items-center gap-2">
                  <button onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors">
                    <FaWhatsapp size={13} /> Share
                  </button>
                  <button onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors">
                    <FiPrinter size={13} /> Print
                  </button>
                  <button onClick={handlePDF}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                    <FiDownload size={13} /> PDF
                  </button>
                  <button onClick={() => setResult(null)}
                    className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                    <FiRefreshCw size={13} />
                  </button>
                </div>
              </div>

              <div ref={printRef}>
                {/* Pass/Fail stripe */}
                <div className={`h-1.5 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} />

                {/* Student header */}
                <div className="bg-gray-900 px-6 py-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">
                        Kerala Pareeksha Bhavan · SSLC 2026
                      </p>
                      <h3 className="text-white text-xl font-black">{result.studentName}</h3>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-400">
                        <span>Reg: {result.registerNumber}</span>
                        <span>{result.district}</span>
                        <span>{result.schoolName}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <span className={`px-5 py-2 rounded-xl font-black text-lg ${
                        isPassed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {result.result}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${getGradeBg(result.grade)}`}>
                        Grade: {result.grade}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 border-b border-gray-100 divide-x divide-gray-100">
                  {[
                    { label: 'Total Marks', value: `${result.totalMarks}/${result.maxMarks}`, color: 'text-green-700' },
                    { label: 'Percentage',  value: `${result.percentage}%`,                   color: 'text-gray-900' },
                    { label: 'Grade',       value: result.grade,                              color: 'text-amber-600' },
                    { label: 'A+ Subjects', value: String(result.aPlusCount),                 color: 'text-emerald-600' },
                  ].map(s => (
                    <div key={s.label} className="py-4 text-center">
                      <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Subjects table */}
                <div className="p-5">
                  <p className="text-sm font-bold text-gray-800 mb-3">Subject-wise Marks</p>
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                          <th className="text-left px-4 py-2.5 font-semibold">Subject</th>
                          <th className="text-center px-3 py-2.5 font-semibold">Theory</th>
                          <th className="text-center px-3 py-2.5 font-semibold">Practical</th>
                          <th className="text-center px-3 py-2.5 font-semibold">Total</th>
                          <th className="text-center px-3 py-2.5 font-semibold">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {result.subjects.map((sub, i) => (
                          <tr key={sub.code} className={`hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                            <td className="px-4 py-2.5 font-medium text-gray-800">
                              {sub.isAPlus && <span className="text-amber-400 mr-1.5">★</span>}
                              {sub.name}
                            </td>
                            <td className="text-center px-3 py-2.5 text-gray-600">{sub.theory}</td>
                            <td className="text-center px-3 py-2.5 text-gray-600">{sub.practical || '—'}</td>
                            <td className="text-center px-3 py-2.5 font-bold text-gray-900">{sub.total}</td>
                            <td className="text-center px-3 py-2.5">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(sub.grade)}`}>
                                {sub.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 border-t border-gray-200 font-black">
                          <td className="px-4 py-2.5 text-gray-900">TOTAL</td>
                          <td colSpan={2} />
                          <td className="text-center px-3 py-2.5 text-green-700">{result.totalMarks}</td>
                          <td className="text-center px-3 py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-black ${getGradeColor(result.grade)}`}>
                              {result.grade}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg border border-gray-200">
                      <QRCodeSVG
                        value={`https://sslc.akhilshijoinnov.site/verify/${result.registerNumber}`}
                        size={64} level="M" includeMargin={false}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="font-semibold text-gray-700">Scan to Verify</p>
                      <p className="mt-0.5">sslc.akhilshijoinnov.site</p>
                      <p>DOB: {formatDate(result.dateOfBirth)}</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-gray-400">
                    <p>Computer-generated result</p>
                    <p>Kerala Pareeksha Bhavan © 2026</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════
            SECTION 3 — School Result Search
        ══════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-800 px-6 py-4">
            <h2 className="text-white font-bold text-base">School-wise Result</h2>
            <p className="text-gray-400 text-xs mt-0.5">Enter a school code to view all student results</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSchool} className="flex gap-3">
              <input
                type="text"
                value={schoolCode}
                onChange={e => setSchoolCode(e.target.value.toUpperCase())}
                placeholder="School code (e.g. 12345)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                disabled={schoolLoading}
                className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold text-sm rounded-lg transition-colors flex-shrink-0"
              >
                {schoolLoading
                  ? <FiLoader className="animate-spin" size={16} />
                  : <><FiSearch size={15} /> Search</>
                }
              </button>
            </form>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 4 — School Results Table
        ══════════════════════════════════════ */}
        <AnimatePresence>
          {schoolData && (
            <motion.section
              id="school-results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Summary */}
              <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap gap-6 items-center">
                {[
                  { label: 'Total', value: schoolData.stats.total, color: 'text-gray-900' },
                  { label: 'Passed', value: schoolData.stats.passed, color: 'text-green-600' },
                  { label: 'Pass %', value: `${schoolData.stats.passPercentage}%`, color: 'text-green-700' },
                  { label: 'A+', value: schoolData.stats.totalAPlus, color: 'text-amber-600' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                ))}
                <div className="ml-auto text-xs text-gray-400">
                  Page {schoolData.pagination.page} / {schoolData.pagination.pages}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
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
                  <tbody className="divide-y divide-gray-50">
                    {schoolData.results.map((s, i) => (
                      <tr key={s.registerNumber} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                          {(schoolData.pagination.page - 1) * 20 + i + 1}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.registerNumber}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{s.studentName}</td>
                        <td className="text-center px-4 py-3 font-bold text-gray-900">{s.totalMarks}</td>
                        <td className="text-center px-4 py-3 text-gray-600">{s.percentage}%</td>
                        <td className="text-center px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(s.grade)}`}>
                            {s.grade}
                          </span>
                        </td>
                        <td className="text-center px-4 py-3 text-amber-500 font-bold text-xs">
                          {s.aPlusCount > 0 ? s.aPlusCount : '—'}
                        </td>
                        <td className="text-center px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            s.result === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
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
                <div className="flex items-center justify-center gap-1.5 px-4 py-3 border-t border-gray-100">
                  <button
                    onClick={() => handleSchool(null, schoolPage - 1)}
                    disabled={schoolPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50"
                  >
                    <FiChevronLeft size={15} />
                  </button>
                  {Array.from({ length: Math.min(schoolData.pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => handleSchool(null, p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        p === schoolPage ? 'bg-green-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => handleSchool(null, schoolPage + 1)}
                    disabled={schoolPage === schoolData.pagination.pages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50"
                  >
                    <FiChevronRight size={15} />
                  </button>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════
            SECTION 5 — Quick Stats
        ══════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-base">Kerala SSLC 2026 — Overall Statistics</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
            {[
              { label: 'Total Students',  value: 425000, suffix: '',  color: 'text-gray-900' },
              { label: 'Students Passed', value: 382500, suffix: '',  color: 'text-green-600' },
              { label: 'Pass Percentage', value: 90.0,   suffix: '%', color: 'text-green-700' },
              { label: 'Total A+ Grades', value: 125000, suffix: '',  color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="p-5 text-center">
                <p className={`text-2xl font-black ${s.color}`}>
                  <CountUp end={s.value} duration={2} separator="," decimals={s.suffix === '%' ? 1 : 0} suffix={s.suffix} />
                </p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-8 bg-gray-900 text-gray-400 text-xs text-center py-5 px-4">
        <p className="font-medium text-gray-300 mb-1">Kerala Pareeksha Bhavan — SSLC Result Portal 2026</p>
        <p>© 2026 Kerala Pareeksha Bhavan. All rights reserved.</p>
        <p className="mt-1">
          <a href="https://sslc.akhilshijoinnov.site" className="text-green-400 hover:text-green-300 transition-colors">
            sslc.akhilshijoinnov.site
          </a>
        </p>
      </footer>
    </div>
  )
}
