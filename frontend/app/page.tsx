'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReactToPrint } from 'react-to-print'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import CountUp from 'react-countup'
import { QRCodeSVG } from 'qrcode.react'
import { FiSearch, FiDownload, FiPrinter, FiShare2, FiRefreshCw, FiLoader, FiChevronLeft, FiChevronRight, FiAward, FiBook, FiUsers, FiTrendingUp } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { fetchIndividualResult, fetchSchoolResults } from '@/lib/api'
import { ResultData, SchoolData } from '@/lib/types'
import { getGradeColor, getGradeBg, formatDate, getWhatsAppShareUrl } from '@/lib/utils'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

/* ── Floating particle component ── */
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 8,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-green-500/20"
          style={{
            width: p.size, height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            animation: `float-up ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ── 3D Tilt card wrapper ── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`
  }
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

/* ── Animated scanning loader ── */
function ScanLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-2xl border-2 border-green-500/30" />
        <div className="absolute inset-0 rounded-2xl border-t-2 border-green-400 animate-spin" />
        <div className="absolute inset-3 rounded-xl border border-green-500/20" />
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="scan-line" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FiSearch className="text-green-400" size={28} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-green-400 font-semibold text-sm tracking-widest uppercase animate-pulse">Fetching Result</p>
        <p className="text-white/40 text-xs mt-1">Please wait...</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [regno, setRegno] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultData | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const [schoolCode, setSchoolCode] = useState('')
  const [schoolLoading, setSchoolLoading] = useState(false)
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)
  const [schoolPage, setSchoolPage] = useState(1)

  const handleIndividual = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regno.trim()) return toast.error('Enter register number')
    if (!dob) return toast.error('Enter date of birth')
    setLoading(true)
    setResult(null)
    try {
      const r = await fetchIndividualResult(regno.trim().toUpperCase(), dob)
      setResult(r)
      if (r.result === 'PASS') { setConfetti(true); setTimeout(() => setConfetti(false), 5000) }
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 200)
    } catch (err: any) {
      toast.error(err.message || 'Result not found. Check your details.')
    } finally {
      setLoading(false)
    }
  }

  const handleSchool = async (e: React.FormEvent | null, p = 1) => {
    e?.preventDefault()
    if (!schoolCode.trim()) return toast.error('Enter school code')
    setSchoolLoading(true)
    try {
      const r = await fetchSchoolResults(schoolCode.trim(), p, 20)
      setSchoolData(r)
      setSchoolPage(p)
      setTimeout(() => document.getElementById('school-section')?.scrollIntoView({ behavior: 'smooth' }), 200)
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

  const handlePDF = async () => {
    if (!result) return
    setPdfLoading(true)
    try {
      const { generateStylishPDF } = await import('@/lib/pdfGenerator')
      await generateStylishPDF(result)
      toast.success('PDF downloaded!')
    } catch {
      toast.error('PDF generation failed')
    } finally {
      setPdfLoading(false)
    }
  }

  const isPassed = result?.result === 'PASS'

  return (
    <div className="min-h-screen bg-[#080810] text-white relative overflow-x-hidden">
      {confetti && <Confetti recycle={false} numberOfPieces={300} colors={['#22c55e','#10b981','#4ade80','#fbbf24','#f59e0b','#a3e635']} />}
      <Particles />

      {/* ── Ambient glow blobs ── */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ══════════════ HEADER ══════════════ */}
      <header className="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <FiAward size={20} className="text-white" />
              <div className="absolute inset-0 rounded-xl bg-green-400/20 animate-ping" />
            </div>
            <div>
              <p className="font-bold text-sm text-white leading-tight">Kerala Pareeksha Bhavan</p>
              <p className="text-green-400 text-xs">SSLC Result Portal 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Results Live</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* ══════════════ HERO SEARCH ══════════════ */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <TiltCard>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm shadow-2xl">
              {/* animated top border */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" />

              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl font-black text-white mb-2"
                  >
                    Check Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                      SSLC Result
                    </span>
                  </motion.h1>
                  <p className="text-white/40 text-sm">Enter your details to get instant results</p>
                </div>

                <form onSubmit={handleIndividual} className="space-y-4 max-w-lg mx-auto">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Register Number</label>
                      <input
                        type="text"
                        value={regno}
                        onChange={e => setRegno(e.target.value.toUpperCase())}
                        placeholder="e.g. 1234567"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-green-500/60 focus:bg-white/8 transition-all duration-300 font-mono tracking-widest text-sm"
                        maxLength={20}
                        autoComplete="off"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/60 focus:bg-white/8 transition-all duration-300 text-sm [color-scheme:dark]"
                        max="2015-12-31"
                        min="2005-01-01"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:from-green-800 disabled:to-emerald-800 text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                    {loading ? (
                      <><FiLoader className="animate-spin" size={18} /> Fetching Result...</>
                    ) : (
                      <><FiSearch size={18} /> Get Result Instantly</>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* ══════════════ LOADING STATE ══════════════ */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
              <ScanLoader />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════ RESULT CARD ══════════════ */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              id="result-section"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* Action bar */}
              <div className="flex items-center justify-between mb-3 no-print">
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Result Card</p>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(getWhatsAppShareUrl(result.registerNumber, result.studentName, result.result, result.grade), '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold rounded-lg hover:bg-[#25D366]/30 transition-all">
                    <FaWhatsapp size={13} /> Share
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 text-xs font-semibold rounded-lg hover:bg-white/10 transition-all">
                    <FiPrinter size={13} /> Print
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handlePDF}
                    disabled={pdfLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50">
                    {pdfLoading ? <FiLoader size={13} className="animate-spin" /> : <FiDownload size={13} />}
                    {pdfLoading ? 'Generating...' : 'PDF'}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setResult(null)}
                    className="p-1.5 bg-white/5 border border-white/10 text-white/40 rounded-lg hover:bg-white/10 transition-all">
                    <FiRefreshCw size={13} />
                  </motion.button>
                </div>
              </div>

              <div ref={printRef} className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Pass/Fail top stripe */}
                <div className={`h-1.5 ${isPassed ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-400' : 'bg-gradient-to-r from-red-500 via-rose-500 to-red-500'}`} />

                {/* Student header */}
                <div className="bg-gradient-to-br from-[#0d1117] to-[#0a0f1a] px-6 py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-1.5">Kerala Pareeksha Bhavan · SSLC 2026</p>
                      <h2 className="text-white text-2xl font-black tracking-tight">{result.studentName}</h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-white/40">
                        <span className="font-mono">Reg: {result.registerNumber}</span>
                        <span>{result.district}</span>
                        <span>{result.schoolName}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
                        className={`px-6 py-2.5 rounded-xl font-black text-xl shadow-lg ${
                          isPassed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30'
                            : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-500/30'
                        }`}
                      >
                        {result.result}
                      </motion.span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${getGradeBg(result.grade)}`}>
                        Grade: {result.grade}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 bg-[#0a0f1a] border-t border-white/5">
                  {[
                    { label: 'Total Marks', value: `${result.totalMarks}/${result.maxMarks}`, color: 'text-green-400' },
                    { label: 'Percentage',  value: `${result.percentage}%`,                   color: 'text-white' },
                    { label: 'Grade',       value: result.grade,                              color: 'text-amber-400' },
                    { label: 'A+ Subjects', value: String(result.aPlusCount),                 color: 'text-emerald-400' },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i + 0.4 }}
                      className="py-4 text-center border-r border-white/5 last:border-r-0"
                    >
                      <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Subjects table */}
                <div className="bg-[#080810] p-5">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Subject-wise Marks</p>
                  <div className="rounded-xl overflow-hidden border border-white/5">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-white/5 text-xs text-white/30 uppercase tracking-wide">
                          <th className="text-left px-4 py-3 font-semibold">Subject</th>
                          <th className="text-center px-3 py-3 font-semibold">Theory</th>
                          <th className="text-center px-3 py-3 font-semibold">Practical</th>
                          <th className="text-center px-3 py-3 font-semibold">Total</th>
                          <th className="text-center px-3 py-3 font-semibold">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.subjects.map((sub, i) => (
                          <motion.tr
                            key={sub.code}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 + 0.5 }}
                            className="border-t border-white/5 hover:bg-white/[0.03] transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-white/80">
                              {sub.isAPlus && <span className="text-amber-400 mr-1.5 text-xs">★</span>}
                              {sub.name}
                            </td>
                            <td className="text-center px-3 py-3 text-white/50">{sub.theory}</td>
                            <td className="text-center px-3 py-3 text-white/50">{sub.practical || '—'}</td>
                            <td className="text-center px-3 py-3 font-bold text-white">{sub.total}</td>
                            <td className="text-center px-3 py-3">
                              <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${getGradeColor(sub.grade)}`}>
                                {sub.grade}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-white/10 bg-green-500/5">
                          <td className="px-4 py-3 font-black text-green-400 text-sm">TOTAL</td>
                          <td colSpan={2} />
                          <td className="text-center px-3 py-3 font-black text-green-400 text-sm">{result.totalMarks}</td>
                          <td className="text-center px-3 py-3">
                            <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-black ${getGradeColor(result.grade)}`}>
                              {result.grade}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Card footer with QR */}
                <div className="bg-[#0a0f1a] border-t border-white/5 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg">
                      <QRCodeSVG
                        value={`https://sslc.akhilshijoinnov.site/verify/${result.registerNumber}`}
                        size={60} level="M" includeMargin={false}
                      />
                    </div>
                    <div className="text-xs text-white/40">
                      <p className="font-semibold text-white/60">Scan to Verify</p>
                      <p className="mt-0.5">sslc.akhilshijoinnov.site</p>
                      <p>DOB: {formatDate(result.dateOfBirth)}</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-white/20">
                    <p>Computer-generated result</p>
                    <p>Kerala Pareeksha Bhavan © 2026</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════ STATS SECTION ══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: 'Total Students',  value: 425000, suffix: '',  icon: <FiUsers size={18} />,     color: 'from-green-500/20 to-green-500/5',   border: 'border-green-500/20', text: 'text-green-400' },
            { label: 'Students Passed', value: 382500, suffix: '',  icon: <FiAward size={18} />,     color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
            { label: 'Pass Percentage', value: 90.0,   suffix: '%', icon: <FiTrendingUp size={18} />, color: 'from-teal-500/20 to-teal-500/5',    border: 'border-teal-500/20',   text: 'text-teal-400' },
            { label: 'Total A+ Grades', value: 125000, suffix: '',  icon: <FiBook size={18} />,      color: 'from-amber-500/20 to-amber-500/5',   border: 'border-amber-500/20',  text: 'text-amber-400' },
          ].map((s, i) => (
            <TiltCard key={s.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.4 }}
                className={`rounded-xl border ${s.border} bg-gradient-to-br ${s.color} p-4 text-center backdrop-blur-sm`}
              >
                <div className={`${s.text} flex justify-center mb-2 opacity-70`}>{s.icon}</div>
                <p className={`text-2xl font-black ${s.text}`}>
                  <CountUp end={s.value} duration={2.5} separator="," decimals={s.suffix === '%' ? 1 : 0} suffix={s.suffix} />
                </p>
                <p className="text-xs text-white/40 mt-1">{s.label}</p>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>

        {/* ══════════════ SCHOOL SEARCH ══════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <TiltCard>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiUsers className="text-green-400" size={18} />
                  <h2 className="font-bold text-white text-base">School-wise Result</h2>
                </div>
                <form onSubmit={handleSchool} className="flex gap-3">
                  <input
                    type="text"
                    value={schoolCode}
                    onChange={e => setSchoolCode(e.target.value.toUpperCase())}
                    placeholder="Enter school code (e.g. 12345)"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-green-500/60 transition-all duration-300 text-sm font-mono"
                  />
                  <motion.button
                    type="submit"
                    disabled={schoolLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-green-500/20 shrink-0"
                  >
                    {schoolLoading ? <FiLoader className="animate-spin" size={16} /> : <FiSearch size={16} />}
                    Search
                  </motion.button>
                </form>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* ══════════════ SCHOOL RESULTS TABLE ══════════════ */}
        <AnimatePresence>
          {schoolData && (
            <motion.div
              id="school-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] overflow-hidden"
            >
              {/* School stats */}
              <div className="px-5 py-4 border-b border-white/5 flex flex-wrap gap-6 items-center">
                {[
                  { label: 'Total',   value: schoolData.stats.total,             color: 'text-white' },
                  { label: 'Passed',  value: schoolData.stats.passed,            color: 'text-green-400' },
                  { label: 'Pass %',  value: `${schoolData.stats.passPercentage}%`, color: 'text-emerald-400' },
                  { label: 'A+',      value: schoolData.stats.totalAPlus,        color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-xs text-white/30">{s.label}</p>
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                ))}
                <div className="ml-auto text-xs text-white/30">
                  Page {schoolData.pagination.page} / {schoolData.pagination.pages}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 text-xs text-white/30 uppercase tracking-wide">
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
                  <tbody>
                    {schoolData.results.map((s, i) => (
                      <motion.tr
                        key={s.registerNumber}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-t border-white/5 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-4 py-3 text-white/30 text-xs font-mono">{(schoolData.pagination.page - 1) * 20 + i + 1}</td>
                        <td className="px-4 py-3 font-mono text-xs text-white/40">{s.registerNumber}</td>
                        <td className="px-4 py-3 font-medium text-white/80">{s.studentName}</td>
                        <td className="text-center px-4 py-3 font-bold text-white">{s.totalMarks}</td>
                        <td className="text-center px-4 py-3 text-white/50">{s.percentage}%</td>
                        <td className="text-center px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(s.grade)}`}>{s.grade}</span>
                        </td>
                        <td className="text-center px-4 py-3 text-amber-400 font-bold text-xs">{s.aPlusCount > 0 ? s.aPlusCount : '—'}</td>
                        <td className="text-center px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            s.result === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>{s.result}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {schoolData.pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-1.5 px-4 py-4 border-t border-white/5">
                  <button onClick={() => handleSchool(null, schoolPage - 1)} disabled={schoolPage === 1}
                    className="p-2 rounded-lg border border-white/10 text-white/40 disabled:opacity-30 hover:bg-white/5 transition-all">
                    <FiChevronLeft size={15} />
                  </button>
                  {Array.from({ length: Math.min(schoolData.pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => handleSchool(null, p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        p === schoolPage
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20'
                          : 'border border-white/10 text-white/40 hover:bg-white/5'
                      }`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => handleSchool(null, schoolPage + 1)} disabled={schoolPage === schoolData.pagination.pages}
                    className="p-2 rounded-lg border border-white/10 text-white/40 disabled:opacity-30 hover:bg-white/5 transition-all">
                    <FiChevronRight size={15} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="relative z-10 border-t border-white/5 mt-10 px-4 py-6 text-center">
        <p className="text-white/30 text-xs">Kerala Pareeksha Bhavan — SSLC Result Portal 2026</p>
        <p className="text-white/20 text-xs mt-1">© 2026 Kerala Pareeksha Bhavan. All rights reserved.</p>
        <a href="https://sslc.akhilshijoinnov.site" className="text-green-500/60 hover:text-green-400 text-xs mt-1 inline-block transition-colors">
          sslc.akhilshijoinnov.site
        </a>
      </footer>
    </div>
  )
}
