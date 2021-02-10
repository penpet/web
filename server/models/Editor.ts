import WebSocket from 'ws'
import ShareDB from 'sharedb'
import JSONStream from '@teamwork/websocket-json-stream'
import richText from 'rich-text'

ShareDB.types.register(richText.type)

const server = new ShareDB()
const connection = server.connect()

const edit = async (id: string, socket: WebSocket) => {
	const doc = connection.get('pens', id)

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
