'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiUser, FiCalendar, FiLoader, FiShield, FiDownload, FiShare2 } from 'react-icons/fi'
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
        document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    } catch (err: any) {
      toast.error(err.message || 'Result not found. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">

          {/* Section label */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Check Your Result</h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Enter your register number and date of birth to view your result
            </p>
          </div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="card p-8"
          >
            <form onSubmit={handleSearch} className="space-y-5">

              {/* Register Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Register Number
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={regno}
                    onChange={(e) => setRegno(e.target.value.toUpperCase())}
                    placeholder="e.g. 1234567"
                    className="field-input pl-10 font-mono tracking-widest"
                    maxLength={20}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="field-input pl-10"
                    max="2015-12-31"
                    min="2005-01-01"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-blue w-full py-3 text-sm"
              >
                {loading ? (
                  <><FiLoader className="animate-spin" size={16} /> Fetching Result...</>
                ) : (
                  <><FiSearch size={16} /> Get My Result</>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-5 flex items-center justify-center gap-1.5 text-slate-400 text-xs">
              <FiShield size={12} />
              <span>Your data is encrypted and not stored permanently</span>
            </div>
          </motion.div>

          {/* Feature row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: <FiSearch size={16} />, title: 'Instant', desc: 'Results in seconds' },
              { icon: <FiDownload size={16} />, title: 'PDF', desc: 'Download mark sheet' },
              { icon: <FiShare2 size={16} />, title: 'Share', desc: 'WhatsApp & SMS' },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center"
              >
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 mb-2">
                  {f.icon}
                </div>
                <p className="text-xs font-semibold text-slate-700">{f.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
