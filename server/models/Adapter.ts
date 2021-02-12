import { DB } from 'sharedb'
import { Pool, PoolConfig } from 'pg'

export const COLLECTION = 'pens'

export default class Adapter extends DB {
	closed: boolean
	pool: Pool

	constructor(options: PoolConfig) {
		super()

		this.closed = false
		this.pool = new Pool(options)
	}

	close = async (callback?: (error?: Error) => void) => {
		try {
			this.closed = true
			await this.pool.end()

			callback?.()
		} catch (error) {
			callback?.(error)
		}
	}

	commit = async (
		collection: string,
		id: string,
		op: unknown,
		snapshot: Snapshot,
		_options: unknown,
		callback: (...args: unknown[]) => void
	) => {
		try {
			if (collection !== COLLECTION) throw new Error('Invalid collection')
			const client = await this.pool.connect()

			try {
				const {
					rows: operations
				} = await client.query(
					'SELECT max(version) AS max_version FROM operations WHERE id = $1',
					[id]
				)

				const maxVersion: number = operations[0]?.max_version ?? 0
				if (snapshot.v !== maxVersion + 1) return callback(null, false)

				try {
					await client.query('BEGIN')

					await client.query(
						'INSERT INTO operations (id, version, operation) VALUES ($1, $2, $3)',
						[id, snapshot.v, op]
					)

					await client.query(
						snapshot.v === 1
							? 'INSERT INTO snapshots (id, type, version, data) VALUES ($1, $2, $3, $4)'
							: 'UPDATE snapshots SET type = $2, version = $3, data = $4 WHERE id = $1 AND version = ($3 - 1)',
						[id, snapshot.type, snapshot.v, snapshot.data]
					)

					await client.query('COMMIT')
				} finally {
					await client.query('ROLLBACK')
				}

				callback(null, true)
			} finally {
				client.release()
			}
		} catch (error) {
			callback(error)
		}
	}

	getSnapshot = async (
		collection: string,
		id: string,
		_fields: unknown,
		_options: unknown,
		callback: (...args: unknown[]) => void
	) => {
		try {
			if (collection !== COLLECTION) throw new Error('Invalid collection')
			const client = await this.pool.connect()

			try {
				const {
					rows
				} = await client.query(
					'SELECT type, version, data FROM snapshots WHERE id = $1',
					[id]
				)

				const row = rows[0]
				const snapshot: Snapshot = {
					id,
					type: row?.type ?? null,
					v: row?.version ?? 0,
					data: row?.data
				}

				callback(null, snapshot)
			} finally {
				client.release()
			}
		} catch (error) {
			callback(error)
		}
	}

	getOps = async (
		collection: string,
		id: string,
		from: number | null,
		to: number | null,
		_options: unknown,
		callback: (...args: unknown[]) => void
	) => {
		try {
			if (collection !== COLLECTION) throw new Error('Invalid collection')
			const client = await this.pool.connect()

			try {
				const {
					rows
				} = await client.query(
					'SELECT operation FROM operations WHERE id = $1 AND version >= $2 AND version < $3',
					[id, from, to]
				)

				callback(
					null,
					rows.map(({ operation }) => operation)
				)
			} finally {
				client.release()
			}
		} catch (error) {
			callback(error)
		}
	}
}

export interface Snapshot {
	id: string
	type: string
	v: number
	data: unknown
}
