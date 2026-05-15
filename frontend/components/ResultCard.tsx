'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useReactToPrint } from 'react-to-print'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import {
  FiDownload, FiPrinter, FiX, FiAward,
  FiBook, FiMapPin, FiHash
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
    const url = getWhatsAppShareUrl(result.registerNumber, result.studentName, result.result, result.grade)
    window.open(url, '_blank')
  }

  const handleDownloadPDF = () => {
    toast.loading('Generating PDF...')
    downloadPDF(result.registerNumber, result.dateOfBirth)
    setTimeout(() => toast.dismiss(), 2000)
  }

  return (
    <section id="result-card" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={250}
          onConfettiComplete={() => setShowConfetti(false)}
          colors={['#3b82f6', '#6366f1', '#10b981', '#f59e0b']}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="max-w-3xl mx-auto"
      >
        {/* Action bar */}
        <div className="flex items-center justify-between mb-3 no-print">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiAward className="text-blue-500" size={16} />
            Result Card
          </h2>
          <div className="flex items-center gap-1.5">
            <button onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors shadow-sm">
              <FaWhatsapp size={13} /> Share
            </button>
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              <FiPrinter size={13} /> Print
            </button>
            <button onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
              <FiDownload size={13} /> PDF
            </button>
            <button onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <FiX size={15} />
            </button>
          </div>
        </div>

        {/* Main card */}
        <div
          ref={printRef}
          className={`print-card rounded-2xl overflow-hidden border ${
            isPassed
              ? 'border-emerald-200 dark:border-emerald-800/60 pass-glow'
              : 'border-red-200 dark:border-red-900/60 fail-glow'
          } bg-white dark:bg-slate-900`}
        >
          {/* Top accent */}
          <div className={`h-1 ${isPassed ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`} />

          {/* Header */}
          <div className={`relative overflow-hidden ${
            isPassed
              ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900'
              : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          } px-6 py-5`}>
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/4 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/4 rounded-full" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Student info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <p className="text-blue-300/80 text-[10px] font-semibold uppercase tracking-widest mb-0.5">
                    Kerala Pareeksha Bhavan · SSLC 2026
                  </p>
                  <h3 className="text-white text-lg sm:text-xl font-black leading-tight">{result.studentName}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-blue-300/80 text-xs">
                      <FiHash size={10} /> {result.registerNumber}
                    </span>
                    <span className="flex items-center gap-1 text-blue-300/80 text-xs">
                      <FiMapPin size={10} /> {result.district}
                    </span>
                  </div>
                </div>
              </div>

              {/* Result badge */}
              <div className="flex flex-col items-start sm:items-end gap-2">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, delay: 0.2 }}
                  className={`px-5 py-2 rounded-xl font-black text-xl shadow-lg ${
                    isPassed
                      ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-emerald-500/30'
                      : 'bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-red-500/30'
                  }`}
                >
                  {isPassed ? '✅ PASS' : '❌ FAIL'}
                </motion.div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getGradeBg(result.grade)} text-white`}>
                  Grade: {result.grade}
                </div>
              </div>
            </div>

            {/* School info */}
            <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-blue-200/70 text-xs">
                <FiBook size={11} /> {result.schoolName}
              </span>
              <span className="flex items-center gap-1.5 text-blue-200/70 text-xs">
                <span className="text-blue-400/70">Code:</span>
                <span className="font-mono">{result.schoolCode}</span>
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 divide-x divide-slate-100 dark:divide-slate-700/60 border-b border-slate-100 dark:border-slate-700/60">
            {[
              { label: 'Total Marks', value: `${result.totalMarks}/${result.maxMarks}`, icon: '📊', color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Percentage',  value: `${result.percentage}%`,                   icon: '📈', color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Grade',       value: result.grade,                              icon: '🏆', color: 'text-amber-600 dark:text-amber-400' },
              { label: 'A+ Subjects', value: result.aPlusCount.toString(),              icon: '⭐', color: 'text-emerald-600 dark:text-emerald-400' },
            ].map((stat) => (
              <div key={stat.label} className="py-4 px-3 text-center bg-white dark:bg-slate-900">
                <div className="text-lg mb-0.5">{stat.icon}</div>
                <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-gray-400 dark:text-slate-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Subjects table */}
          <div className="bg-white dark:bg-slate-900 p-5">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-1.5">
              <FiBook className="text-blue-500" size={14} />
              Subject-wise Marks
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-xs">
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400">Subject</th>
                    <th className="text-center px-3 py-2.5 font-semibold text-slate-600 dark:text-slate-400">Theory</th>
                    <th className="text-center px-3 py-2.5 font-semibold text-slate-600 dark:text-slate-400">Practical</th>
                    <th className="text-center px-3 py-2.5 font-semibold text-slate-600 dark:text-slate-400">Total</th>
                    <th className="text-center px-3 py-2.5 font-semibold text-slate-600 dark:text-slate-400">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40">
                  {result.subjects.map((subject, idx) => (
                    <motion.tr
                      key={subject.code}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          {subject.isAPlus && <span className="text-amber-400 text-xs">⭐</span>}
                          <span className="font-medium text-gray-800 dark:text-slate-200 text-sm">{subject.name}</span>
                        </div>
                      </td>
                      <td className="text-center px-3 py-2.5 text-gray-500 dark:text-slate-400 text-sm">{subject.theory}</td>
                      <td className="text-center px-3 py-2.5 text-gray-500 dark:text-slate-400 text-sm">{subject.practical || '—'}</td>
                      <td className="text-center px-3 py-2.5 font-bold text-gray-900 dark:text-white text-sm">{subject.total}</td>
                      <td className="text-center px-3 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/60">
                    <td className="px-4 py-2.5 font-black text-gray-900 dark:text-white text-sm">TOTAL</td>
                    <td colSpan={2} />
                    <td className="text-center px-3 py-2.5 font-black text-blue-700 dark:text-blue-400 text-sm">
                      {result.totalMarks}
                    </td>
                    <td className="text-center px-3 py-2.5">
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
          <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-600">
                <QRCodeSVG
                  value={`https://sslc.akhilshijoinnov.site/verify/${result.registerNumber}`}
                  size={64}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">Scan to Verify</p>
                <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">sslc.akhilshijoinnov.site</p>
                <p className="text-[11px] text-gray-400 dark:text-slate-500">DOB: {formatDate(result.dateOfBirth)}</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[11px] text-gray-400 dark:text-slate-500">Computer-generated result</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500">Kerala Pareeksha Bhavan © 2026</p>
              {result.fromCache && (
                <span className="inline-block mt-1 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  ⚡ Cached
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
