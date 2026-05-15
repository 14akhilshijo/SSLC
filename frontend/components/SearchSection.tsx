'use client'
import { useState } from 'react'
import { FiSearch, FiLoader } from 'react-icons/fi'
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
      setTimeout(() => {
        document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: any) {
      toast.error(err.message || 'Result not found. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">

        {/* Page title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Check SSLC Result 2026</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your details below to view your result</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSearch} className="space-y-4">

            <div>
              <label htmlFor="regno" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Register Number
              </label>
              <input
                id="regno"
                type="text"
                value={regno}
                onChange={(e) => setRegno(e.target.value.toUpperCase())}
                placeholder="Enter your register number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono tracking-wider"
                maxLength={20}
                autoComplete="off"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                max="2015-12-31"
                min="2005-01-01"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              {loading
                ? <><FiLoader className="animate-spin" size={16} /> Fetching Result...</>
                : <><FiSearch size={16} /> Get Result</>
              }
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 Your data is secure and not stored permanently
          </p>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Having trouble? Make sure your register number and date of birth are correct.
        </p>
      </div>
    </section>
  )
}
