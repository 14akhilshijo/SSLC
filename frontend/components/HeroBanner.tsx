'use client'
import { motion } from 'framer-motion'

const features = [
  { icon: '⚡', label: 'Instant Results' },
  { icon: '📄', label: 'PDF Download' },
  { icon: '📱', label: 'WhatsApp Share' },
  { icon: '🏫', label: 'School-wise' },
  { icon: '🔒', label: 'Secure & Official' },
]

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* Subtle mesh overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99,102,241,0.4) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(14,165,233,0.3) 0%, transparent 50%)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-blue-200 text-xs font-medium mb-5"
        >
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Results Live — May 2026
        </motion.div>

        {/* Emblem */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
          className="flex justify-center mb-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shadow-xl backdrop-blur-sm">
            <span className="text-2xl">🏛️</span>
            <span className="text-white/60 text-[8px] font-bold mt-0.5 tracking-widest">KERALA</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-3"
        >
          Kerala SSLC
          <span className="block gradient-text-gold mt-1">Result 2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="text-blue-200/80 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Official Kerala Pareeksha Bhavan portal. Check individual results,
          school-wise results and download mark sheets instantly.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {features.map((f) => (
            <span
              key={f.label}
              className="glass px-3 py-1.5 rounded-full text-white/85 text-xs font-medium flex items-center gap-1.5"
            >
              {f.icon} {f.label}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-xl hover:bg-blue-50 active:scale-95 transition-all duration-150"
          >
            🔍 Check My Result
          </a>
          <a
            href="#search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white font-semibold text-sm hover:bg-white/15 active:scale-95 transition-all duration-150"
          >
            🏫 School Results
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-5 h-8 border border-white/25 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-0.5 h-1.5 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
