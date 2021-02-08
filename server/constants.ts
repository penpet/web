export const PROD = process.env.NODE_ENV === 'production'
export const DEV = process.env.NODE_ENV === 'development'

export const PORT = process.env.PORT ?? '5000'

export const API_ORIGIN = DEV
	? 'http://localhost:5000'
	: 'https://penpet.herokuapp.com'

export const ORIGIN = DEV ? 'http://localhost:3000' : API_ORIGIN

export const ID_LENGTH = 10
