import { Duplex } from 'stream'
import WebSocket from 'ws'

import { isOpen } from '../utils/socket'

export default class Stream extends Duplex {
	constructor(private readonly socket: WebSocket, readonly = false) {
		super({ objectMode: true })

		socket.on('message', message => {
			try {
				if (typeof message !== 'string') throw new Error('Invalid message')
				const data: unknown = JSON.parse(message)

				if (
					readonly &&
					typeof data === 'object' &&
					(data as Record<string, unknown> | null)?.a === 'op'
				)
					throw new Error('Unable to write to a read-only endpoint')

				this.push(data)
			} catch {
				this.close()
			}
		})

		socket.on('close', () => {
			this.push(null)
			this.end()

			this.emit('close')
			this.emit('end')
		})

		this.on('error', this.close)
		this.on('end', this.close)
	}

	private readonly close = () => {
		if (isOpen(this.socket)) this.socket.close()
	}

	readonly _read = () => {
		// Do nothing
	}

	readonly _write = (message: unknown, _encoding: unknown, next: unknown) => {
		try {
			this.socket.send(JSON.stringify(message))
		} catch {
			this.close()
		}

		if (typeof next === 'function') next()
	}
}
