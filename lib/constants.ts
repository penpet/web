export const DEV = process.env.NODE_ENV === 'development'

export const API_ORIGIN = DEV
	? 'http://localhost:5000'
	: 'https://penpet.herokuapp.com'
