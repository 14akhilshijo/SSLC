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
    <header className="sticky top-0 z-50 glass-dark shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/30 flex-shrink-0">
              <span className="text-white font-black text-[10px] tracking-tight">KPB</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-white font-semibold text-sm">Kerala Pareeksha Bhavan</p>
              <p className="text-blue-400 text-[11px]">SSLC Result Portal 2026</p>
            </div>
            <div className="sm:hidden">
              <p className="text-white font-semibold text-sm">SSLC 2026</p>
            </div>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {(['individual', 'school'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/8'
                }`}
              >
                {tab === 'individual' ? '🎓 Individual' : '🏫 School'}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <a href="#search" className="hidden sm:inline-flex btn-primary text-xs py-2 px-3.5">
              Check Result
            </a>
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
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
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/8 bg-slate-900/98 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {(['individual', 'school'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setMenuOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-white/8'
                  }`}
                >
                  {tab === 'individual' ? '🎓 Individual Result' : '🏫 School Result'}
                </button>
              ))}
              <a
                href="#search"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center btn-primary mt-2"
              >
                Check Result
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
