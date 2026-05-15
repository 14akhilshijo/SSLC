import axios from 'axios'
import { ResultData, SchoolData, OverallStats } from './types'

const BASE_URL =
  typeof window !== 'undefined'
    ? '' // use Next.js rewrites in browser (proxied via /api/*)
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      (err.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : 'Network error. Please check your connection.')
    return Promise.reject(new Error(message))
  }
)

export const fetchIndividualResult = async (regno: string, dob: string): Promise<ResultData> => {
  const { data } = await api.get('/api/results/individual', { params: { regno, dob } })
  return data.data
}

export const fetchSchoolResults = async (code: string, page = 1, limit = 20): Promise<SchoolData> => {
  const { data } = await api.get('/api/results/school', { params: { code, page, limit } })
  return data.data
}

export const fetchStatistics = async (): Promise<OverallStats> => {
  const { data } = await api.get('/api/results/statistics')
  return data.data
}

export const downloadPDF = (regno: string, dob: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://api.sslc.akhilshijoinnov.site'
  const url = `${base}/api/results/pdf?regno=${regno}&dob=${dob}`
  window.open(url, '_blank')
}

export const searchSchools = async (q: string) => {
  const { data } = await api.get('/api/schools/search', { params: { q } })
  return data.data
}
