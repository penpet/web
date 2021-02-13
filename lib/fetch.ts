import HttpError from 'models/HttpError'
import { ORIGIN } from './constants'

const getResponse = async (url: string, init?: RequestInit) => {
	const response = await globalThis.fetch(`${ORIGIN}/${url}`, init)
	if (response.ok) return response

	throw new HttpError(response.status, await response.text())
}

const fetch = async <Response = unknown>(url: string, init?: RequestInit) =>
	(await (await getResponse(url, init)).json()) as Response

export const fetchVoid = async (url: string, init?: RequestInit) => {
	await getResponse(url, init)
}

export default fetch
