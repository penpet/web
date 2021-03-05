export default interface ErrorDescription {
	title: string
	description: string
	message: string
}

export const getUnknownError = (status: number): ErrorDescription => ({
	title: `Error (${status})`,
	description: `An unknown error occurred (${status})`,
	message: `An unknown error occurred (${status})`
})

export const UNKNOWN_ERROR_STATUS = 500
export const UNKNOWN_ERROR = getUnknownError(UNKNOWN_ERROR_STATUS)
