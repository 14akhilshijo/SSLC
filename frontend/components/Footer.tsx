'use client'
import { motion } from 'framer-motion'
import { FiGlobe, FiMail, FiPhone } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-black text-sm">KPB</span>
              </div>
              <div>
                <p className="font-bold text-white">Kerala Pareeksha Bhavan</p>
                <p className="text-blue-400 text-xs">SSLC Result Portal 2026</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Official result portal for Kerala SSLC Examination 2026. Fast, secure and reliable
              result checking for students across all 14 districts of Kerala.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://sslc.akhilshijoinnov.site" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                <FiGlobe size={14} /> sslc.akhilshijoinnov.site
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                'Individual Result',
                'School-wise Result',
                'Result Statistics',
                'Download Mark Sheet',
                'Verify Result',
              ].map((link) => (
                <li key={link}>
                  <a href="#search" className="hover:text-blue-400 transition-colors">
                    → {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Information</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                'About Kerala Pareeksha Bhavan',
                'Grading System',
                'Re-valuation Process',
                'Supplementary Exam',
                'Contact Support',
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    → {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Grade scale */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <h4 className="text-sm font-semibold text-slate-400 mb-4 text-center">Grading Scale</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { grade: 'A+', range: '90-100', color: 'bg-emerald-900/50 text-emerald-400 border-emerald-800' },
              { grade: 'A',  range: '80-89',  color: 'bg-green-900/50 text-green-400 border-green-800' },
              { grade: 'B+', range: '70-79',  color: 'bg-blue-900/50 text-blue-400 border-blue-800' },
              { grade: 'B',  range: '60-69',  color: 'bg-cyan-900/50 text-cyan-400 border-cyan-800' },
              { grade: 'C+', range: '50-59',  color: 'bg-yellow-900/50 text-yellow-400 border-yellow-800' },
              { grade: 'C',  range: '40-49',  color: 'bg-orange-900/50 text-orange-400 border-orange-800' },
              { grade: 'D',  range: '30-39',  color: 'bg-red-900/50 text-red-400 border-red-800' },
              { grade: 'E',  range: '0-29',   color: 'bg-slate-800 text-slate-400 border-slate-700' },
            ].map((g) => (
              <div key={g.grade} className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${g.color}`}>
                <span className="font-bold">{g.grade}</span>
                <span className="ml-1 opacity-70">{g.range}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Kerala Pareeksha Bhavan. All rights reserved.</p>
          <p>
            Built with ❤️ for Kerala students |{' '}
            <a href="https://sslc.akhilshijoinnov.site" className="text-blue-500 hover:text-blue-400">
              sslc.akhilshijoinnov.site
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
