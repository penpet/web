import Pen from 'models/Pen'
import formatTimeAgo from './formatTimeAgo'
import normalize from './normalize'

const queryPens = (query: string) => {
	const normalizedQuery = normalize(query)

	return (pen: Pen) =>
		normalize(pen.name).includes(normalizedQuery) ||
		normalize(pen.role).includes(normalizedQuery) ||
		normalize(formatTimeAgo(pen.created)).includes(normalizedQuery) ||
		normalize(formatTimeAgo(pen.updated)).includes(normalizedQuery)
}

export default queryPens
