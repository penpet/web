export const isOpen = ({ readyState, CONNECTING, OPEN }: WebSocket) =>
	readyState === CONNECTING || readyState === OPEN
