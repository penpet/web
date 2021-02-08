const PUBLIC_ORIGIN = process.env.NEXT_PUBLIC_ORIGIN
if (!PUBLIC_ORIGIN) throw new Error('Missing public origin')

export const DEV = process.env.NODE_ENV === 'development'
export const PORT = process.env.PORT ?? '5000'

export const ORIGIN = DEV ? 'http://localhost:3000' : PUBLIC_ORIGIN
export const API_ORIGIN = DEV ? 'http://localhost:5000' : PUBLIC_ORIGIN

export const ID_LENGTH = 10
