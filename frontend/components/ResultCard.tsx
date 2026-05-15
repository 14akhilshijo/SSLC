'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReactToPrint } from 'react-to-print'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import {
  FiDownload, FiPrinter, FiShare2, FiX, FiAward,
  FiBook, FiMapPin, FiHash, FiCheckCircle, FiXCircle
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
          numberOfPieces={300}
          onConfettiComplete={() => setShowConfetti(false)}
          colors={['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444']}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="max-w-4xl mx-auto"
      >
        {/* Action bar */}
        <div className="flex items-center justify-between mb-4 no-print">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiAward className="text-blue-500" />
            Result Card
          </h2>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">
              <FaWhatsapp size={16} /> Share
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              <FiPrinter size={16} /> Print
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
              <FiDownload size={16} /> PDF
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
              <FiX size={18} />
            </motion.button>
          </div>
        </div>

        {/* Main card */}
        <div
          ref={printRef}
          className={`print-card rounded-3xl overflow-hidden shadow-2xl border-2 ${
            isPassed
              ? 'border-emerald-200 dark:border-emerald-800 pass-glow'
              : 'border-red-200 dark:border-red-900 fail-glow'
          }`}
        >
          {/* Header */}
          <div className={`relative overflow-hidden bg-gradient-to-r ${
            isPassed ? 'from-blue-900 via-blue-800 to-indigo-900' : 'from-slate-900 via-slate-800 to-slate-900'
          } p-6 sm:p-8`}>
            {/* BG decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">👤</span>
                </div>
                <div>
                  <p className="text-blue-300 text-xs font-medium uppercase tracking-wider mb-1">
                    Kerala Pareeksha Bhavan — SSLC 2026
                  </p>
                  <h3 className="text-white text-xl sm:text-2xl font-black">{result.studentName}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-blue-200 text-sm">
                      <FiHash size={12} /> {result.registerNumber}
                    </span>
                    <span className="flex items-center gap-1 text-blue-200 text-sm">
                      <FiMapPin size={12} /> {result.district}
                    </span>
                  </div>
                </div>
              </div>

              {/* Result badge */}
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                  className={`px-6 py-3 rounded-2xl font-black text-2xl shadow-2xl ${
                    isPassed
                      ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-emerald-500/40'
                      : 'bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-red-500/40'
                  }`}
                >
                  {isPassed ? '✅ PASS' : '❌ FAIL'}
                </motion.div>
                <div className={`px-4 py-1.5 rounded-xl text-sm font-bold bg-gradient-to-r ${getGradeBg(result.grade)} text-white`}>
                  Grade: {result.grade}
                </div>
              </div>
            </div>

            {/* School info */}
            <div className="relative z-10 mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <FiBook size={14} />
                <span>{result.schoolName}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <span className="text-blue-400">Code:</span>
                <span className="font-mono">{result.schoolCode}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 dark:bg-slate-700">
            {[
              { label: 'Total Marks', value: `${result.totalMarks}/${result.maxMarks}`, icon: '📊', color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Percentage', value: `${result.percentage}%`, icon: '📈', color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Overall Grade', value: result.grade, icon: '🏆', color: 'text-amber-600 dark:text-amber-400' },
              { label: 'A+ Subjects', value: result.aPlusCount.toString(), icon: '⭐', color: 'text-emerald-600 dark:text-emerald-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-slate-800 p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Subjects table */}
          <div className="bg-white dark:bg-slate-800 p-6">
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiBook className="text-blue-500" />
              Subject-wise Marks
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="text-left px-4 py-3 font-semibold rounded-tl-2xl">Subject</th>
                    <th className="text-center px-3 py-3 font-semibold">Theory</th>
                    <th className="text-center px-3 py-3 font-semibold">Practical</th>
                    <th className="text-center px-3 py-3 font-semibold">Total</th>
                    <th className="text-center px-3 py-3 font-semibold rounded-tr-2xl">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((subject, idx) => (
                    <motion.tr
                      key={subject.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-b border-gray-50 dark:border-slate-700 transition-colors hover:bg-blue-50/50 dark:hover:bg-slate-700/50 ${
                        idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50/50 dark:bg-slate-800/50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {subject.isAPlus && <span className="text-amber-500 text-xs">⭐</span>}
                          <span className="font-medium text-gray-800 dark:text-slate-200">{subject.name}</span>
                        </div>
                      </td>
                      <td className="text-center px-3 py-3 text-gray-600 dark:text-slate-400">{subject.theory}</td>
                      <td className="text-center px-3 py-3 text-gray-600 dark:text-slate-400">{subject.practical || '—'}</td>
                      <td className="text-center px-3 py-3 font-bold text-gray-900 dark:text-white">{subject.total}</td>
                      <td className="text-center px-3 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-700">
                    <td className="px-4 py-3 font-black text-gray-900 dark:text-white">TOTAL</td>
                    <td colSpan={2} />
                    <td className="text-center px-3 py-3 font-black text-blue-700 dark:text-blue-400 text-base">
                      {result.totalMarks}
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className={`inline-block px-3 py-1 rounded-lg text-sm font-black ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer: QR + verification */}
          <div className="bg-gray-50 dark:bg-slate-900 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-gray-200 dark:border-slate-600">
                <QRCodeSVG
                  value={`https://sslc.akhilshijoinnov.site/verify/${result.registerNumber}`}
                  size={80}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">Scan to Verify</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                  sslc.akhilshijoinnov.site
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  DOB: {formatDate(result.dateOfBirth)}
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs text-gray-400 dark:text-slate-500">
                This is a computer-generated result.
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                Kerala Pareeksha Bhavan © 2026
              </p>
              {result.fromCache && (
                <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  ⚡ Cached result
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
