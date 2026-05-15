export interface Subject {
  code: string
  name: string
  theory: number
  practical: number
  total: number
  grade: string
  isAPlus: boolean
}

export interface ResultData {
  registerNumber: string
  dateOfBirth: string
  studentName: string
  schoolCode: string
  schoolName: string
  district: string
  subjects: Subject[]
  totalMarks: number
  maxMarks: number
  percentage: number
  result: 'PASS' | 'FAIL' | 'WITHHELD' | 'ABSENT'
  grade: string
  aPlusCount: number
  rank?: number
  schoolRank?: number
  year: number
  qrCode?: string
  fromCache?: boolean
  source?: string
}

export interface SchoolStats {
  total: number
  passed: number
  failed: number
  passPercentage: number
  totalAPlus: number
}

export interface SchoolResult {
  registerNumber: string
  studentName: string
  totalMarks: number
  percentage: number
  result: string
  grade: string
  aPlusCount: number
}

export interface SchoolData {
  results: SchoolResult[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  stats: SchoolStats
}

export interface OverallStats {
  total: number
  passed: number
  failed: number
  passPercentage: number
  totalAPlus: number
  year: number
  districtStats: Array<{
    _id: string
    total: number
    passed: number
    avgMarks: number
  }>
  lastUpdated: string
}
