import localFetch from './fetch'
import handleError from './handleError'

interface SignedUrl {
	url: string
	destination: string
}

const upload = async (file: File) => {
	try {
		if (!file.type.startsWith('image/'))
			throw new Error('You must upload an image')

		const { url, destination } = await localFetch<SignedUrl>(
			`signed?name=${encodeURIComponent(file.name)}`,
			{
				headers: { 'Content-Type': file.type }
			}
		)

		const response = await fetch(url, {
			method: 'PUT',
			headers: { 'Access-Control-Request-Method': 'PUT' },
			body: file
		})
		if (!response.ok) throw new Error(await response.text())

		return destination
	} catch (error) {
		handleError(error)
		throw error
	}
}

export default upload
