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
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-[10px]">KPB</span>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-sm leading-none">Kerala Pareeksha Bhavan</p>
              <p className="text-blue-200 text-[11px] mt-0.5">SSLC Result Portal 2026</p>
            </div>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden sm:flex items-center gap-1 bg-blue-800/50 rounded-lg p-1">
            {(['individual', 'school'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 font-semibold shadow-sm'
                    : 'text-blue-100 hover:bg-blue-600/50'
                }`}
              >
                {tab === 'individual' ? 'Individual Result' : 'School Result'}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-1.5 rounded-lg hover:bg-blue-600/50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="sm:hidden border-t border-blue-600/50 overflow-hidden"
          >
            <div className="px-4 py-2 flex flex-col gap-1">
              {(['individual', 'school'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setMenuOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white text-blue-700 font-semibold'
                      : 'text-blue-100 hover:bg-blue-600/50'
                  }`}
                >
                  {tab === 'individual' ? 'Individual Result' : 'School Result'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
