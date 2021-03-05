import ErrorDescription, { getUnknownError } from 'models/ErrorDescription'

const getError = (status: number): ErrorDescription => {
	switch (status) {
		case 401:
			return {
				title: 'Private pen',
				description: "You won't be able to view this pen if you're not invited",
				message: 'This pen is private'
			}
		case 404:
			return {
				title: '404',
				description: "This pen doesn't exist",
				message: "This pen doesn't exist"
			}
		default:
			return getUnknownError(status)
	}
}

export default getError
