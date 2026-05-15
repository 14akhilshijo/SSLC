'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiUser, FiCalendar, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { fetchIndividualResult } from '@/lib/api'
import { ResultData } from '@/lib/types'

interface Props {
  onResult: (r: ResultData) => void
}

export default function SearchSection({ onResult }: Props) {
  const [regno, setRegno] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regno.trim()) return toast.error('Please enter your register number')
    if (!dob) return toast.error('Please enter your date of birth')

    setLoading(true)
    try {
      const result = await fetchIndividualResult(regno.trim().toUpperCase(), dob)
      onResult(result)
      toast.success('Result found! Scroll down to view.')
      document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth' })
    } catch (err: any) {
      toast.error(err.message || 'Result not found. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass-white dark:glass-dark rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-blue-100 dark:border-slate-700">
          {/* Card header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4">
              <FiSearch className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Check Your Result</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
              Enter your register number and date of birth
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-5">
            {/* Register Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                Register Number
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                <input
                  type="text"
                  value={regno}
                  onChange={(e) => setRegno(e.target.value.toUpperCase())}
                  placeholder="e.g. 1234567"
                  className="input-kerala pl-11 uppercase font-mono tracking-wider"
                  maxLength={20}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="input-kerala pl-11"
                  max="2015-12-31"
                  min="2005-01-01"
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full py-4 text-base"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={20} />
                  Fetching Result...
                </>
              ) : (
                <>
                  <FiSearch size={20} />
                  Get Result
                </>
              )}
            </motion.button>
          </form>

          {/* Info note */}
          <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4">
            🔒 Your data is secure and not stored permanently
          </p>
        </div>

        {/* Quick tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 grid grid-cols-3 gap-3"
        >
          {[
            { icon: '⚡', title: 'Instant', desc: 'Results in seconds' },
            { icon: '📄', title: 'PDF', desc: 'Download mark sheet' },
            { icon: '📱', title: 'Share', desc: 'WhatsApp & SMS' },
          ].map((tip) => (
            <div
              key={tip.title}
              className="glass-white dark:glass-dark rounded-2xl p-3 text-center border border-blue-50 dark:border-slate-700"
            >
              <div className="text-2xl mb-1">{tip.icon}</div>
              <div className="text-xs font-bold text-gray-700 dark:text-slate-300">{tip.title}</div>
              <div className="text-xs text-gray-400 dark:text-slate-500">{tip.desc}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
