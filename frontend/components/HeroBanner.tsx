'use client'
import { motion } from 'framer-motion'

interface Props {
  activeTab: 'individual' | 'school'
  setActiveTab: (t: 'individual' | 'school') => void
}

export default function HeroBanner({ activeTab, setActiveTab }: Props) {
  return (
    <section className="hero-bg relative overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 glass-hero px-3.5 py-1.5 rounded-full text-blue-100 text-xs font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Results Declared — May 2026
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4"
          >
            Kerala SSLC
            <span className="block text-gradient-gold mt-1">Result 2026</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-blue-200 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10"
          >
            Official Kerala Pareeksha Bhavan portal. Check individual results,
            school-wise results and download mark sheets instantly.
          </motion.p>

          {/* Tab switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="inline-flex items-center glass-hero rounded-2xl p-1.5 mb-8"
          >
            {(['individual', 'school'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                {tab === 'individual' ? '🎓 Individual Result' : '🏫 School Result'}
              </button>
            ))}
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {[
              { icon: '⚡', label: 'Instant Results' },
              { icon: '📄', label: 'PDF Download' },
              { icon: '📱', label: 'WhatsApp Share' },
              { icon: '🏫', label: 'School-wise' },
              { icon: '🔒', label: 'Secure & Official' },
            ].map((f) => (
              <span
                key={f.label}
                className="glass-hero px-3 py-1.5 rounded-full text-blue-100 text-xs font-medium flex items-center gap-1.5"
              >
                {f.icon} {f.label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40 L0 20 Q360 0 720 20 Q1080 40 1440 20 L1440 40 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
