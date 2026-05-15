'use client'
import { FiGlobe, FiMail, FiPhone } from 'react-icons/fi'

const gradeScale = [
  { grade: 'A+', range: '90–100', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { grade: 'A',  range: '80–89',  cls: 'bg-green-50  text-green-700  border-green-200' },
  { grade: 'B+', range: '70–79',  cls: 'bg-blue-50   text-blue-700   border-blue-200' },
  { grade: 'B',  range: '60–69',  cls: 'bg-sky-50    text-sky-700    border-sky-200' },
  { grade: 'C+', range: '50–59',  cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { grade: 'C',  range: '40–49',  cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  { grade: 'D',  range: '30–39',  cls: 'bg-red-50    text-red-700    border-red-200' },
  { grade: 'E',  range: '0–29',   cls: 'bg-slate-50  text-slate-600  border-slate-200' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-[11px]">KPB</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm">Kerala Pareeksha Bhavan</p>
                <p className="text-slate-400 text-[11px]">SSLC Result Portal 2026</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Official result portal for Kerala SSLC Examination 2026. Providing fast, secure
              and reliable result access for students across all 14 districts of Kerala.
            </p>
            <div className="mt-4 space-y-1.5">
              <a
                href="https://sslc.akhilshijoinnov.site"
                className="flex items-center gap-2 text-slate-400 hover:text-blue-400 text-xs transition-colors"
              >
                <FiGlobe size={12} /> sslc.akhilshijoinnov.site
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                'Individual Result',
                'School-wise Result',
                'Result Statistics',
                'Download Mark Sheet',
                'Verify Result',
              ].map((link) => (
                <li key={link}>
                  <a href="#search" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-4">Information</h4>
            <ul className="space-y-2">
              {[
                'About Pareeksha Bhavan',
                'Grading System',
                'Re-valuation Process',
                'Supplementary Exam',
                'Contact Support',
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Grading scale */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
            Grading Scale
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {gradeScale.map((g) => (
              <div
                key={g.grade}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${g.cls}`}
              >
                <span className="font-bold">{g.grade}</span>
                <span className="ml-1.5 opacity-70">{g.range}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Kerala Pareeksha Bhavan. All rights reserved.</p>
          <p>
            Built for Kerala students ·{' '}
            <a href="https://sslc.akhilshijoinnov.site" className="text-blue-500 hover:text-blue-400 transition-colors">
              sslc.akhilshijoinnov.site
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
