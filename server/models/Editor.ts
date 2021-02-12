import WebSocket from 'ws'
import ShareDB from 'sharedb'
import Adapter, { COLLECTION } from './Adapter'
import JSONStream from '@teamwork/websocket-json-stream'
import richText from 'rich-text'

import { options as databaseOptions } from '../database'

ShareDB.types.register(richText.type)

const db = new Adapter(databaseOptions)
const server = new ShareDB({ db })

const connection = server.connect()

const edit = async (id: string, socket: WebSocket) => {
	const doc = connection.get(COLLECTION, id)

	await new Promise<void>((resolve, reject) => {
		doc.fetch(error => {
			error ? reject(error) : resolve()
		})
	})

	if (doc.type === null)
		await new Promise<void>((resolve, reject) => {
			doc.create(null, 'rich-text', error => {
				error ? reject(error) : resolve()
			})
		})

	server.listen(new JSONStream(socket))
}

export default edit
