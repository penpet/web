const truncate = (text: string, length: number, ellipsis = '...') =>
	text.length > length
		? `${text.slice(0, length - ellipsis.length)}${ellipsis}`
		: text

export default truncate
