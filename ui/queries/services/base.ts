import axios, { AxiosError } from 'axios'

const timeout = 10000

export const authApiClient = axios.create({
  timeout,
  withCredentials: true,
})

export const publicApiClient = axios.create({
  timeout,
})
