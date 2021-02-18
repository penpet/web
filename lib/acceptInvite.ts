import { NextPageContext } from 'next'

import Invite from 'models/Invite'
import HttpError from 'models/HttpError'
import { ORIGIN } from './constants'

const acceptInvite = async (
	id: string,
	context?: NextPageContext
): Promise<string | Invite> => {
	const cookie = context?.req?.headers.cookie

	const response = await fetch(`${ORIGIN}/invites/${id}`, {
		method: 'POST',
		headers: cookie ? { cookie } : undefined
	})

	if (response.ok) return response.text()
	if (response.status === 401) return response.json()

	throw new HttpError(response.status, await response.text())
}

export default acceptInvite
