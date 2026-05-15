'use client'
import { useState } from 'react'
import { useTheme } from './ThemeProvider'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  activeTab: 'individual' | 'school'
  setActiveTab: (t: 'individual' | 'school') => void
}

export default function Header({ activeTab, setActiveTab }: Props) {
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass-dark border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-black text-sm">KPB</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm leading-tight">Kerala Pareeksha Bhavan</p>
              <p className="text-blue-300 text-xs">SSLC Result Portal 2026</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {(['individual', 'school'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === 'individual' ? '🎓 Individual Result' : '🏫 School Result'}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <a
              href="#search"
              className="hidden sm:inline-flex btn-primary text-sm py-2 px-4"
            >
              Check Result
            </a>
            <button
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {(['individual', 'school'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setMenuOpen(false) }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {tab === 'individual' ? '🎓 Individual Result' : '🏫 School Result'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
