import { toast } from 'react-toastify'

const handleError = (error: unknown) => {
	toast.dark(
		error instanceof Error ? error.message : 'An unknown error occurred'
	)
	console.error(error)
}

export default handleError
