import ReconnectingWebSocket from 'reconnecting-websocket'
import Quill, { RangeStatic } from 'quill'
import QuillCursors from 'quill-cursors'
import debounce from 'lodash/debounce'

import { isOpen } from 'lib/socket'
import { SOCKET_ORIGIN } from 'lib/constants'
import handleError from 'lib/handleError'
import { toast } from 'react-toastify'

export default class Cursors {
	private readonly socket: WebSocket
	private readonly module: QuillCursors

	private range: RangeStatic | null = null

	constructor(penId: string, private readonly quill: Quill) {
		const url = `${SOCKET_ORIGIN}/pens/${penId}/cursors`

		this.socket = new ReconnectingWebSocket(url) as WebSocket
		this.module = quill.getModule('cursors')

		this.socket.addEventListener('message', ({ data: message }) => {
			try {
				const { type, ...data } = JSON.parse(message) as CursorMessage

				switch (type) {
					case null: {
						const cursors = data.cursors as Cursor[]

						for (const cursor of cursors) {
							this.module.createCursor(cursor.id, cursor.name, cursor.color)
							this.module.moveCursor(cursor.id, cursor.range)
						}

						break
					}
					case CursorEvent.Created: {
						const { id, name, color, range } = data.cursor as Cursor

						this.module.createCursor(id, name, color)
						this.module.moveCursor(id, range)

						toast.dark(`${name} joined`)

						break
					}
					case CursorEvent.Updated: {
						const { id, range } = data.cursor as Cursor
						this.module.moveCursor(id, range)

						break
					}
					case CursorEvent.Deleted: {
						const { id, name } = data.cursor as Cursor
						this.module.removeCursor(id)

						toast.dark(`${name} left`)

						break
					}
				}
			} catch (error) {
				handleError(error)
			}
		})
	}

	readonly update = (range = this.quill.getSelection()) => {
		try {
			if (!range) return
			this.socket.send(JSON.stringify((this.range = range)))
		} catch (error) {
			handleError(error)
		}
	}

	readonly collapse = () => {
		if (!this.range?.length) return

		const { index, length } = this.range
		this.update({ index: index + length, length: 0 })
	}

	readonly close = () => {
		const { socket } = this
		if (isOpen(socket)) socket.close()
	}
}

export interface Cursor {
	id: string
	name: string
	color: string
	range: RangeStatic
}

export interface CursorMessage extends Record<string, unknown> {
	type: CursorEvent | null
}

export enum CursorEvent {
	Created,
	Updated,
	Deleted
}
