'use client'
import { motion } from 'framer-motion'

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-animated min-h-[420px] flex items-center">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${10 + i * 8}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-blue-200 text-sm font-medium mb-6"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Results Live — May 2026
        </motion.div>

        {/* Kerala Emblem */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl">🏛️</div>
              <div className="text-white/70 text-[9px] font-bold mt-0.5">KERALA</div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight"
        >
          Kerala SSLC
          <span className="block gradient-text-gold">Result 2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-blue-200 text-lg sm:text-xl max-w-2xl mx-auto mb-8"
        >
          Official Kerala Pareeksha Bhavan result portal. Fast, secure and reliable.
          Check individual results, school-wise results and download mark sheets.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
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
              className="glass px-3 py-1.5 rounded-full text-white/90 text-sm font-medium flex items-center gap-1.5"
            >
              <span>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
