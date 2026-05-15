'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            <p className="text-white text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold">LIVE</span>
              </span>
              Kerala SSLC Result 2026 officially declared — check your result now.
            </p>
            <button
              onClick={() => setVisible(false)}
              className="flex-shrink-0 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-colors"
              aria-label="Dismiss"
            >
              <FiX size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
