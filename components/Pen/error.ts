export interface ErrorDescription {
	title: string
	description: string
	message: string
}

const getUnknownError = (status: number): ErrorDescription => ({
	title: `Error (${status})`,
	description: `An unknown error occurred (${status})`,
	message: `An unknown error occurred (${status})`
})

export const UNKNOWN_ERROR_STATUS = 500
export const UNKNOWN_ERROR = getUnknownError(UNKNOWN_ERROR_STATUS)

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
