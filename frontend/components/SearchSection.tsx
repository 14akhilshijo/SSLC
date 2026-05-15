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
      toast.success('Result found!')
      setTimeout(() => {
        document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err: any) {
      toast.error(err.message || 'Result not found. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg mx-auto"
      >
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 overflow-hidden">

          {/* Card top accent */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

          <div className="p-7">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/25 flex-shrink-0">
                <FiSearch className="text-white" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Check Your Result</h2>
                <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">Enter register number and date of birth</p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              {/* Register Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Register Number
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    value={regno}
                    onChange={(e) => setRegno(e.target.value.toUpperCase())}
                    placeholder="e.g. 1234567"
                    className="input-kerala pl-10 font-mono tracking-wider text-sm"
                    maxLength={20}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Date of Birth
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="input-kerala pl-10 text-sm"
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
                className="btn-primary w-full py-3 text-sm mt-1"
              >
                {loading ? (
                  <><FiLoader className="animate-spin" size={16} /> Fetching Result...</>
                ) : (
                  <><FiSearch size={16} /> Get Result</>
                )}
              </motion.button>
            </form>

            <p className="text-center text-[11px] text-gray-400 dark:text-slate-600 mt-4">
              🔒 Your data is not stored permanently
            </p>
          </div>
        </div>

        {/* Quick feature chips */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { icon: '⚡', title: 'Instant', desc: 'Results in seconds' },
            { icon: '📄', title: 'PDF', desc: 'Download mark sheet' },
            { icon: '📱', title: 'Share', desc: 'WhatsApp & SMS' },
          ].map((tip) => (
            <div
              key={tip.title}
              className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="text-xl mb-1">{tip.icon}</div>
              <div className="text-xs font-semibold text-gray-700 dark:text-slate-300">{tip.title}</div>
              <div className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{tip.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
