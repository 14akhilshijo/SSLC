'use client'
import { useState } from 'react'
import { FiLoader } from 'react-icons/fi'
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
    if (!regno.trim()) return toast.error('Enter your register number')
    if (!dob) return toast.error('Enter your date of birth')

    setLoading(true)
    try {
      const result = await fetchIndividualResult(regno.trim().toUpperCase(), dob)
      onResult(result)
      setTimeout(() => {
        document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: any) {
      toast.error(err.message || 'Result not found. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-start justify-center pt-10 pb-6 px-4 bg-white">
      <div className="w-full max-w-sm">

        <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Check Your Result</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Kerala SSLC Examination 2026</p>

        <form onSubmit={handleSearch} className="space-y-4">

          <div>
            <label htmlFor="regno" className="block text-sm font-medium text-gray-700 mb-1">
              Register Number
            </label>
            <input
              id="regno"
              type="text"
              value={regno}
              onChange={(e) => setRegno(e.target.value.toUpperCase())}
              placeholder="e.g. 1234567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono tracking-widest"
              maxLength={20}
              autoComplete="off"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              max="2015-12-31"
              min="2005-01-01"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading
              ? <><FiLoader className="animate-spin" size={16} /> Getting Result...</>
              : 'Get Result'
            }
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          🔒 Secure · Data not stored permanently
        </p>
      </div>
    </div>
  )
}
