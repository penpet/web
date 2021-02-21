import WebSocket from 'ws'
import ShareDB from 'sharedb'
import richText from 'rich-text'

import Role from './Role'
import Adapter, { COLLECTION } from './Adapter'
import Stream from './Stream'
import { options as databaseOptions } from '../database'

ShareDB.types.register(richText.type)

const db = new Adapter(databaseOptions)
const server = new ShareDB({ db })

const connection = server.connect()

const edit = async (socket: WebSocket, penId: string, role: Role) => {
	const doc = connection.get(COLLECTION, penId)

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

	server.listen(new Stream(socket, role === Role.Viewer))
}

export default edit
