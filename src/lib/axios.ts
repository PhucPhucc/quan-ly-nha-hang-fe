import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.API_URL, // ví dụ: http://localhost:5000
  timeout: 5000,
})
