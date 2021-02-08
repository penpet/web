export const DEV = process.env.NODE_ENV === 'development'

export const API_ORIGIN = DEV
	? 'http://localhost:5000'
	: 'https://penpet.herokuapp.com'

export const ORIGIN = DEV ? 'http://localhost:3000' : API_ORIGIN
