'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiLock, FiUsers, FiSearch, FiRefreshCw, FiActivity, FiLogOut } from 'react-icons/fi'

interface DashboardData {
  totalResults: number
  todaySearches: number
  recentSearches: Array<{ registerNumber: string; timestamp: string; success: boolean }>
}

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/admin/login', { email, password })
      setToken(res.data.token)
      setLoggedIn(true)
      toast.success('Welcome, Admin!')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setData(res.data.data)
    } catch {
      toast.error('Failed to load dashboard')
    }
  }

  const flushCache = async () => {
    try {
      await axios.post('/api/admin/cache/flush', {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Cache flushed!')
    } catch {
      toast.error('Failed to flush cache')
    }
  }

  useEffect(() => {
    if (loggedIn) fetchDashboard()
  }, [loggedIn])

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-animated flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-white dark:glass-dark rounded-3xl p-8 w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl mb-4">
              <FiLock className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin Portal</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Kerala SSLC Result Portal 2026</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="input-kerala"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-kerala"
              required
            />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button onClick={() => setLoggedIn(false)} className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm">
          <FiLogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Results Cached', value: data?.totalResults ?? '—', icon: <FiUsers size={24} />, color: 'from-blue-500 to-blue-700' },
            { label: "Today's Searches", value: data?.todaySearches ?? '—', icon: <FiSearch size={24} />, color: 'from-emerald-500 to-green-700' },
            { label: 'System Status', value: 'Operational', icon: <FiActivity size={24} />, color: 'from-indigo-500 to-purple-700' },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${s.color} rounded-2xl p-6 text-white shadow-xl`}
            >
              <div className="mb-3 opacity-80">{s.icon}</div>
              <div className="text-3xl font-black mb-1">{s.value}</div>
              <div className="text-white/70 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="glass-white dark:glass-dark rounded-2xl p-6 shadow-xl border border-blue-50 dark:border-slate-700 mb-8">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={flushCache} className="btn-secondary flex items-center gap-2">
              <FiRefreshCw size={16} /> Flush Cache
            </button>
            <button onClick={fetchDashboard} className="btn-secondary flex items-center gap-2">
              <FiActivity size={16} /> Refresh Data
            </button>
          </div>
        </div>

        {/* Recent searches */}
        {data?.recentSearches && data.recentSearches.length > 0 && (
          <div className="glass-white dark:glass-dark rounded-2xl shadow-xl border border-blue-50 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
              <h2 className="font-bold text-gray-900 dark:text-white">Recent Searches</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800">
                    <th className="text-left px-6 py-3 text-gray-500 dark:text-slate-400 font-medium">Register No.</th>
                    <th className="text-left px-6 py-3 text-gray-500 dark:text-slate-400 font-medium">Time</th>
                    <th className="text-left px-6 py-3 text-gray-500 dark:text-slate-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSearches.map((s, i) => (
                    <tr key={i} className="border-t border-gray-50 dark:border-slate-700">
                      <td className="px-6 py-3 font-mono text-gray-900 dark:text-white">{s.registerNumber}</td>
                      <td className="px-6 py-3 text-gray-500 dark:text-slate-400">
                        {new Date(s.timestamp).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {s.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
