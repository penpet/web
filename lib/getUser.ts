import { NextPageContext } from 'next'

import User from 'models/User'
import { API_ORIGIN } from './constants'

let user: User | null | undefined

const getUser = async ({ req }: NextPageContext): Promise<User | null> => {
	if (user !== undefined) return user

	try {
		const cookie = req?.headers.cookie

		const response = await fetch(`${API_ORIGIN}/auth`, {
			credentials: 'include',
			headers: cookie ? { cookie } : undefined
		})

		return (user = await response.json())
	} catch {
		return null
	}
}

export default getUser
