import HttpError from 'models/HttpError'
import { ORIGIN } from './constants'

export interface FetchOptions extends RequestInit {
	query?: Record<string, string | null | undefined>
}

const getResponse = async (path: string, options?: FetchOptions) => {
	const url = new URL(`${ORIGIN}/${path}`)

	for (const [name, value] of Object.entries(options?.query ?? {}))
		if (typeof value === 'string') url.searchParams.append(name, value)

	const response = await globalThis.fetch(url.href, options)
	if (response.ok) return response

	throw new HttpError(response.status, await response.text())
}

const fetch = async <Response = unknown>(
	path: string,
	options?: FetchOptions
) => (await (await getResponse(path, options)).json()) as Response

export const fetchVoid = async (path: string, options?: FetchOptions) => {
	await getResponse(path, options)
}

export default fetch
