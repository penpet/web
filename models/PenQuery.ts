import { ParsedUrlQuery } from 'querystring'

export default interface PenQuery extends ParsedUrlQuery {
	id?: string
}
