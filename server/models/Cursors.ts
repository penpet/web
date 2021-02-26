import WebSocket from 'ws'
import getRandomColor from 'randomcolor'
import type { RangeStatic } from 'quill'

import Pal from '../models/Pal'
import newId from '../utils/newId'
import getRandomName from '../utils/getRandomName'
import { isOpen } from '../utils/socket'

export default class Cursors {
	private static readonly instances: Record<string, Cursors> = {}

	private readonly cursors: Record<string, Cursor> = {}

	constructor(id: string) {
		if (Object.prototype.hasOwnProperty.call(Cursors.instances, id))
			return Cursors.instances[id]

		Cursors.instances[id] = this
	}

	readonly subscribe = (socket: WebSocket, pal: Pal | undefined) => {
		const id = pal?.id ?? newId()

		const cursor: Cursor = (this.cursors[id] = {
			socket,
			data: {
				id,
				name: pal?.name ?? getRandomName(),
				color: getRandomColor(),
				range: { index: 0, length: 0 }
			}
		})

		this.emitFrom(cursor, CursorEvent.Created)
		this.emitTo(cursor)

		socket.on('message', message => {
			try {
				if (typeof message !== 'string') throw new Error('Invalid message')
				this.update(cursor, JSON.parse(message))
			} catch (error) {
				if (isOpen(socket)) socket.close()
			}
		})

		socket.on('close', () => {
			this.unsubscribe(cursor)
		})
	}

	private readonly update = (cursor: Cursor, range: RangeStatic) => {
		cursor.data.range = range
		this.emitFrom(cursor, CursorEvent.Updated)
	}

	private readonly unsubscribe = (cursor: Cursor) => {
		delete this.cursors[cursor.data.id]
		this.emitFrom(cursor, CursorEvent.Deleted)
	}

	private readonly emitFrom = ({ data: source }: Cursor, type: CursorEvent) => {
		for (const { socket, data: cursor } of Object.values(this.cursors))
			if (cursor.id !== source.id && isOpen(socket))
				socket.send(JSON.stringify({ type, cursor: source }))
	}

	private readonly emitTo = ({ socket, data: source }: Cursor) => {
		if (!isOpen(socket)) return

		const cursors = Object.values(this.cursors).reduce(
			(cursors: CursorData[], { data: cursor }) => {
				if (cursor.id !== source.id) cursors.push(cursor)
				return cursors
			},
			[]
		)

		socket.send(JSON.stringify({ type: null, cursors }))
	}
}

export interface Cursor {
	socket: WebSocket
	data: CursorData
}

export interface CursorData {
	id: string
	name: string
	color: string
	range: RangeStatic
}

export enum CursorEvent {
	Created,
	Updated,
	Deleted
}
