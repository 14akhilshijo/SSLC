'use client'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  activeTab: 'individual' | 'school'
  setActiveTab: (t: 'individual' | 'school') => void
}

export default function Header({ activeTab, setActiveTab }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-black text-[11px] tracking-tight">KPB</span>
            </div>
            <div className="leading-tight">
              <p className="text-slate-900 font-bold text-sm">Kerala Pareeksha Bhavan</p>
              <p className="text-slate-500 text-[11px]">SSLC Result Portal 2026</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['individual', 'school'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'individual' ? 'Individual Result' : 'School Result'}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="#search"
              className="hidden sm:inline-flex btn-blue text-xs py-2 px-4"
            >
              Check Result
            </a>
            <button
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
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
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {(['individual', 'school'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setMenuOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'individual' ? 'Individual Result' : 'School Result'}
                </button>
              ))}
              <a
                href="#search"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center btn-blue mt-2"
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
