import { Pool, PoolConfig, PoolClient } from 'pg'

const url = process.env.DATABASE_URL
if (!url) throw new Error('Missing database URL')

export const options: PoolConfig = {
	connectionString: url,
	ssl: { rejectUnauthorized: false }
}

const pool = new Pool(options)

export const useClient = async <Result>(
	transform: (client: PoolClient) => Promise<Result> | Result
) => {
	const client = await pool.connect()

	try {
		return await transform(client)
	} finally {
		client.release()
	}
}

export default pool
