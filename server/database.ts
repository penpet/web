import { Client } from 'pg'

const url = process.env.DATABASE_URL
if (!url) throw new Error('Missing database URL')

const database = new Client({
	connectionString: url,
	ssl: { rejectUnauthorized: false }
})

export default database
