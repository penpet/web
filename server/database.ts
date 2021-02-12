import { Pool, PoolConfig } from 'pg'

const url = process.env.DATABASE_URL
if (!url) throw new Error('Missing database URL')

export const options: PoolConfig = {
	connectionString: url,
	ssl: { rejectUnauthorized: false }
}

export default new Pool(options)
