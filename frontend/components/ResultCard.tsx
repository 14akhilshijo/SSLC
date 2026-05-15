'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useReactToPrint } from 'react-to-print'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import {
  FiDownload, FiPrinter, FiX, FiBook,
  FiMapPin, FiHash, FiCheckCircle, FiXCircle
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { ResultData } from '@/lib/types'
import { getGradeColor, getGradeBg, formatDate, getWhatsAppShareUrl } from '@/lib/utils'
import { downloadPDF } from '@/lib/api'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

interface Props {
  result: ResultData
  onClose: () => void
}

export default function ResultCard({ result, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null)
  const [showConfetti, setShowConfetti] = useState(result.result === 'PASS')
  const isPassed = result.result === 'PASS'

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `SSLC_${result.registerNumber}_2026`,
  })

  const handleShare = () => {
    window.open(getWhatsAppShareUrl(result.registerNumber, result.studentName, result.result, result.grade), '_blank')
  }

  const handleDownloadPDF = () => {
    toast.loading('Generating PDF...')
    downloadPDF(result.registerNumber, result.dateOfBirth)
    setTimeout(() => toast.dismiss(), 2000)
  }

  return (
    <section id="result-card" className="bg-slate-50 border-t border-slate-100 py-10">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={220}
          onConfettiComplete={() => setShowConfetti(false)}
          colors={['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899']}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 no-print">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Result Card</h2>
              <p className="text-slate-500 text-xs mt-0.5">Kerala SSLC Examination 2026</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp size={13} /> Share
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <FiPrinter size={13} /> Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                <FiDownload size={13} /> PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <FiX size={15} />
              </button>
            </div>
          </div>

          {/* Card */}
          <motion.div
            ref={printRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Status stripe */}
            <div className={`h-1.5 ${isPassed ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`} />

            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

                {/* Student info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">👤</span>
                  </div>
                  <div>
                    <p className="text-blue-300 text-[10px] font-semibold uppercase tracking-widest mb-1">
                      Kerala Pareeksha Bhavan · SSLC 2026
                    </p>
                    <h3 className="text-white text-xl font-black leading-tight">{result.studentName}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <FiHash size={10} /> {result.registerNumber}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <FiMapPin size={10} /> {result.district}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Result badge */}
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-lg ${
                      isPassed
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    }`}
                  >
                    {isPassed
                      ? <FiCheckCircle size={18} />
                      : <FiXCircle size={18} />
                    }
                    {result.result}
                  </motion.div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getGradeBg(result.grade)} text-white`}>
                    Overall Grade: {result.grade}
                  </span>
                </div>
              </div>

              {/* School row */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-1">
                <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <FiBook size={11} />
                  {result.schoolName}
                </span>
                <span className="text-slate-500 text-xs font-mono">
                  Code: {result.schoolCode}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 border-b border-slate-100">
              {[
                { label: 'Total Marks',  value: `${result.totalMarks}/${result.maxMarks}`, color: 'text-blue-600' },
                { label: 'Percentage',   value: `${result.percentage}%`,                   color: 'text-indigo-600' },
                { label: 'Grade',        value: result.grade,                              color: 'text-amber-600' },
                { label: 'A+ Subjects',  value: String(result.aPlusCount),                 color: 'text-emerald-600' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`py-5 px-3 text-center ${i < 3 ? 'border-r border-slate-100' : ''}`}
                >
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Subjects table */}
            <div className="p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FiBook className="text-blue-500" size={14} />
                Subject-wise Marks
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Subject</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Theory</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Practical</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects.map((subject, idx) => (
                      <tr
                        key={subject.code}
                        className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors ${
                          idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {subject.isAPlus && (
                              <span className="text-amber-400 text-xs">★</span>
                            )}
                            <span className="font-medium text-slate-800">{subject.name}</span>
                          </div>
                        </td>
                        <td className="text-center px-3 py-3 text-slate-600">{subject.theory}</td>
                        <td className="text-center px-3 py-3 text-slate-600">{subject.practical || '—'}</td>
                        <td className="text-center px-3 py-3 font-bold text-slate-900">{subject.total}</td>
                        <td className="text-center px-3 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 border-t border-slate-200">
                      <td className="px-4 py-3 font-black text-slate-900 text-sm">TOTAL</td>
                      <td colSpan={2} />
                      <td className="text-center px-3 py-3 font-black text-blue-700 text-sm">{result.totalMarks}</td>
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

            {/* Footer */}
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                  <QRCodeSVG
                    value={`https://sslc.akhilshijoinnov.site/verify/${result.registerNumber}`}
                    size={72}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Scan to Verify</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">sslc.akhilshijoinnov.site</p>
                  <p className="text-[11px] text-slate-400">DOB: {formatDate(result.dateOfBirth)}</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-[11px] text-slate-400">This is a computer-generated result.</p>
                <p className="text-[11px] text-slate-400">Kerala Pareeksha Bhavan © 2026</p>
                {result.fromCache && (
                  <span className="inline-block mt-1.5 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                    ⚡ Cached result
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
