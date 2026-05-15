'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
          transition={{ duration: 0.2 }}
          className="overflow-hidden bg-blue-600"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-white text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full font-semibold text-[11px] flex-shrink-0">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                LIVE
              </span>
              <span>Kerala SSLC Result 2026 officially declared. Check your result now.</span>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors p-0.5"
              aria-label="Dismiss"
            >
              <FiX size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
