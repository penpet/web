import { ORIGIN } from './constants'

const fetch = async <Response = unknown>(url: string, init?: RequestInit) => {
	const response = await globalThis.fetch(`${ORIGIN}/${url}`, init)
	if (response.ok) return (await response.json()) as Response

	throw new Error(await response.text())
}

export default fetch
