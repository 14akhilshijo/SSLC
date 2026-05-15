import { ResultData } from './types'

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null
}

function gradeRgb(grade: string): [number, number, number] {
  const map: Record<string, [number, number, number]> = {
    'A+': [16, 185, 129],
    'A':  [34, 197, 94],
    'B+': [20, 184, 166],
    'B':  [6, 182, 212],
    'C+': [234, 179, 8],
    'C':  [249, 115, 22],
    'D':  [239, 68, 68],
    'E':  [107, 114, 128],
  }
  return map[grade] || [107, 114, 128]
}

export async function generateStylishPDF(result: ResultData): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, H = 297
  const isPassed = result.result === 'PASS'

  // ── Deep dark background ──
  doc.setFillColor(8, 10, 20)
  doc.rect(0, 0, W, H, 'F')

  // ── Top accent stripe ──
  doc.setFillColor(16, 185, 129)
  doc.rect(0, 0, W, 1.5, 'F')

  // ── Header card ──
  doc.setFillColor(13, 18, 35)
  doc.roundedRect(8, 6, W - 16, 46, 4, 4, 'F')
  // left green bar
  doc.setFillColor(34, 197, 94)
  doc.roundedRect(8, 6, 3.5, 46, 2, 2, 'F')

  // Kerala Pareeksha Bhavan label
  doc.setTextColor(34, 197, 94)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  doc.text('KERALA PAREEKSHA BHAVAN', 17, 15)

  // Main title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(17)
  doc.setFont('helvetica', 'bold')
  doc.text('SSLC MARK SHEET 2026', 17, 26)

  // Subtitle
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('Secondary School Leaving Certificate Examination', 17, 34)
  doc.text('Official Statement of Marks — Kerala Board', 17, 40)

  // ── PASS / FAIL badge ──
  if (isPassed) {
    doc.setFillColor(20, 83, 45)
    doc.roundedRect(W - 52, 12, 40, 16, 3, 3, 'F')
    doc.setFillColor(34, 197, 94)
    doc.roundedRect(W - 52, 12, 40, 2, 1, 1, 'F')
    doc.setTextColor(134, 239, 172)
  } else {
    doc.setFillColor(69, 10, 10)
    doc.roundedRect(W - 52, 12, 40, 16, 3, 3, 'F')
    doc.setFillColor(239, 68, 68)
    doc.roundedRect(W - 52, 12, 40, 2, 1, 1, 'F')
    doc.setTextColor(252, 165, 165)
  }
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(result.result, W - 32, 23, { align: 'center' })

  // ── Student info card ──
  doc.setFillColor(13, 18, 35)
  doc.roundedRect(8, 58, W - 16, 50, 4, 4, 'F')
  doc.setFillColor(34, 197, 94)
  doc.roundedRect(8, 58, 3.5, 50, 2, 2, 'F')

  doc.setTextColor(34, 197, 94)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  doc.text('STUDENT INFORMATION', 17, 66)

  const leftInfo = [
    ['Register Number', result.registerNumber],
    ['Student Name', result.studentName],
    ['Date of Birth', result.dateOfBirth],
  ]
  const rightInfo = [
    ['School Code', result.schoolCode],
    ['School', result.schoolName.length > 30 ? result.schoolName.slice(0, 30) + '…' : result.schoolName],
    ['District', result.district],
  ]

  leftInfo.forEach(([lbl, val], i) => {
    const y = 74 + i * 12
    doc.setTextColor(100, 116, 139); doc.setFontSize(6); doc.setFont('helvetica', 'normal')
    doc.text(lbl, 17, y)
    doc.setTextColor(241, 245, 249); doc.setFontSize(8); doc.setFont('helvetica', 'bold')
    doc.text(val, 17, y + 5.5)
  })
  rightInfo.forEach(([lbl, val], i) => {
    const y = 74 + i * 12
    doc.setTextColor(100, 116, 139); doc.setFontSize(6); doc.setFont('helvetica', 'normal')
    doc.text(lbl, 113, y)
    doc.setTextColor(241, 245, 249); doc.setFontSize(8); doc.setFont('helvetica', 'bold')
    doc.text(val, 113, y + 5.5)
  })

  // ── Stats row ──
  const stats = [
    { label: 'TOTAL MARKS', value: `${result.totalMarks}/${result.maxMarks}`, color: [34, 197, 94] as [number,number,number] },
    { label: 'PERCENTAGE',  value: `${result.percentage}%`,                   color: [16, 185, 129] as [number,number,number] },
    { label: 'GRADE',       value: result.grade,                              color: gradeRgb(result.grade) },
    { label: 'A+ SUBJECTS', value: String(result.aPlusCount),                 color: [234, 179, 8] as [number,number,number] },
  ]
  const sw = (W - 16) / 4
  stats.forEach((s, i) => {
    const x = 8 + i * sw
    doc.setFillColor(13, 18, 35)
    doc.rect(x, 114, sw, 22, 'F')
    // top color line
    doc.setFillColor(...s.color)
    doc.rect(x + 1, 114, sw - 2, 1.5, 'F')
    // value
    doc.setTextColor(...s.color)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(s.value, x + sw / 2, 124, { align: 'center' })
    // label
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(5.5)
    doc.setFont('helvetica', 'normal')
    doc.text(s.label, x + sw / 2, 131, { align: 'center' })
  })
  // dividers
  doc.setDrawColor(30, 40, 60)
  for (let i = 1; i < 4; i++) {
    doc.line(8 + i * sw, 116, 8 + i * sw, 134)
  }

  // ── Subjects section header ──
  doc.setFillColor(13, 18, 35)
  doc.roundedRect(8, 140, W - 16, 8, 2, 2, 'F')
  doc.setFillColor(34, 197, 94)
  doc.roundedRect(8, 140, 3.5, 8, 2, 2, 'F')
  doc.setTextColor(34, 197, 94)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  doc.text('SUBJECT-WISE MARKS', 17, 146)

  // ── Table header ──
  doc.setFillColor(20, 30, 55)
  doc.rect(8, 150, W - 16, 8, 'F')
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  doc.text('SUBJECT', 13, 155.5)
  doc.text('THEORY',  118, 155.5, { align: 'center' })
  doc.text('PRACTICAL', 143, 155.5, { align: 'center' })
  doc.text('TOTAL',   165, 155.5, { align: 'center' })
  doc.text('GRADE',   192, 155.5, { align: 'center' })

  // ── Subject rows ──
  let ry = 158
  result.subjects.forEach((sub, i) => {
    doc.setFillColor(i % 2 === 0 ? 10 : 13, i % 2 === 0 ? 14 : 18, i % 2 === 0 ? 28 : 35)
    doc.rect(8, ry, W - 16, 9, 'F')

    if (sub.isAPlus) {
      doc.setFillColor(34, 197, 94)
      doc.rect(8, ry, 2, 9, 'F')
    }

    doc.setTextColor(sub.isAPlus ? 134 : 203, sub.isAPlus ? 239 : 213, sub.isAPlus ? 172 : 225)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', sub.isAPlus ? 'bold' : 'normal')
    doc.text(sub.name, 13, ry + 6)

    doc.setTextColor(203, 213, 225)
    doc.setFont('helvetica', 'normal')
    doc.text(String(sub.theory), 118, ry + 6, { align: 'center' })
    doc.text(sub.practical ? String(sub.practical) : '—', 143, ry + 6, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(241, 245, 249)
    doc.text(String(sub.total), 165, ry + 6, { align: 'center' })

    // grade pill
    const gc = gradeRgb(sub.grade)
    doc.setFillColor(...gc)
    doc.roundedRect(185, ry + 1.5, 14, 6, 1.5, 1.5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(6.5)
    doc.text(sub.grade, 192, ry + 6, { align: 'center' })

    ry += 9
  })

  // ── Total row ──
  doc.setFillColor(20, 83, 45)
  doc.rect(8, ry, W - 16, 10, 'F')
  doc.setTextColor(134, 239, 172)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('GRAND TOTAL', 13, ry + 7)
  doc.text(String(result.totalMarks), 165, ry + 7, { align: 'center' })
  const tgc = gradeRgb(result.grade)
  doc.setFillColor(...tgc)
  doc.roundedRect(185, ry + 2, 14, 6, 1.5, 1.5, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(7)
  doc.text(result.grade, 192, ry + 7, { align: 'center' })

  ry += 16

  // ── QR + Verification ──
  if (result.qrCode) {
    try {
      doc.addImage(result.qrCode, 'PNG', W - 44, ry, 34, 34)
      doc.setTextColor(100, 116, 139)
      doc.setFontSize(5.5)
      doc.setFont('helvetica', 'normal')
      doc.text('Scan to verify', W - 27, ry + 37, { align: 'center' })
    } catch (_) {}
  }

  doc.setFillColor(13, 18, 35)
  doc.roundedRect(8, ry, W - 56, 22, 3, 3, 'F')
  doc.setFillColor(34, 197, 94)
  doc.roundedRect(8, ry, 3.5, 22, 2, 2, 'F')
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  doc.text('This is a computer-generated document.', 17, ry + 8)
  doc.text('Verify online at: sslc.akhilshijoinnov.site', 17, ry + 14)
  doc.setTextColor(34, 197, 94)
  doc.setFontSize(5.5)
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 17, ry + 19)

  // ── Footer ──
  doc.setFillColor(13, 18, 35)
  doc.rect(0, H - 12, W, 12, 'F')
  doc.setFillColor(34, 197, 94)
  doc.rect(0, H - 12, W, 1, 'F')
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  doc.text(
    'Kerala Pareeksha Bhavan  ·  SSLC Result Portal 2026  ·  sslc.akhilshijoinnov.site',
    W / 2, H - 5, { align: 'center' }
  )

  doc.save(`SSLC_${result.registerNumber}_2026.pdf`)
}
