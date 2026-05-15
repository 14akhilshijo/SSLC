'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiBell } from 'react-icons/fi'

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FiBell className="animate-pulse flex-shrink-0" size={16} />
              <span className="hidden sm:inline">🎉 Kerala SSLC Result 2026 has been officially declared! Check your result now.</span>
              <span className="sm:hidden">🎉 SSLC Result 2026 Declared!</span>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
