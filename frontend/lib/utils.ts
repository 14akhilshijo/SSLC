import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    'A+': 'grade-aplus',
    'A':  'grade-a',
    'B+': 'grade-bplus',
    'B':  'grade-b',
    'C+': 'grade-cplus',
    'C':  'grade-c',
    'D':  'grade-d',
    'E':  'grade-e',
  }
  return map[grade] || 'grade-e'
}

export function getGradeBg(grade: string): string {
  const map: Record<string, string> = {
    'A+': 'from-emerald-500 to-green-600',
    'A':  'from-green-500 to-teal-600',
    'B+': 'from-teal-500 to-emerald-600',
    'B':  'from-cyan-500 to-teal-600',
    'C+': 'from-yellow-500 to-amber-600',
    'C':  'from-orange-500 to-amber-600',
    'D':  'from-red-400 to-rose-500',
    'E':  'from-gray-400 to-slate-500',
  }
  return map[grade] || 'from-gray-400 to-slate-500'
}

export function formatDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  } catch {
    return dateStr
  }
}

export function shareResult(regno: string, name: string, result: string, grade: string) {
  const text = `🎓 Kerala SSLC Result 2026\n👤 ${name}\n📋 Reg: ${regno}\n✅ Result: ${result} | Grade: ${grade}\n\n🔗 Check yours at: https://sslc.akhilshijoinnov.site`
  if (navigator.share) {
    navigator.share({ title: 'Kerala SSLC Result 2026', text, url: 'https://sslc.akhilshijoinnov.site' })
  } else {
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(wa, '_blank')
  }
}

export function getWhatsAppShareUrl(regno: string, name: string, result: string, grade: string) {
  const text = `🎓 Kerala SSLC Result 2026\n👤 ${name}\n📋 Reg: ${regno}\n✅ Result: ${result} | Grade: ${grade}\n\n🔗 https://sslc.akhilshijoinnov.site`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
