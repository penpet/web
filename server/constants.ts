import { join } from 'path'

const PUBLIC_ORIGIN = process.env.NEXT_PUBLIC_ORIGIN
if (!PUBLIC_ORIGIN) throw new Error('Missing public origin')

export const DEV = process.env.NODE_ENV === 'development'

export const ROOT = join(__dirname, '..')
export const PORT = process.env.PORT ?? '5000'

export const ORIGIN = DEV ? `http://localhost:${PORT}` : PUBLIC_ORIGIN

export const ID_LENGTH = 10

export const PING_INTERVAL = 5000
