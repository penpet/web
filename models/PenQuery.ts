import { ParsedUrlQuery } from 'querystring'

export default interface PenQuery extends ParsedUrlQuery {
	pen?: string
}
