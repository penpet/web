import WebSocket from 'ws'

import { PING_INTERVAL } from '../constants'

export const isOpen = ({ readyState, CONNECTING, OPEN }: WebSocket) =>
	readyState === CONNECTING || readyState === OPEN

export const ping = (socket: WebSocket) => {
	let isAlive = true

	const interval = setInterval(() => {
		if (!isOpen(socket)) return
		if (!isAlive) return socket.close()

		isAlive = false
		socket.ping()
	}, PING_INTERVAL)

	socket.on('pong', () => {
		isAlive = true
	})

	socket.on('close', () => {
		clearInterval(interval)
	})
}
