import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Router from 'next/router'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import Invite from 'models/Invite'
import HttpError from 'models/HttpError'
import acceptInvite from 'lib/acceptInvite'
import redirect from 'lib/redirect'
import getNameFromEmail from 'lib/getNameFromEmail'
import palState from 'state/pal'
import authState from 'state/auth'
import Layout from 'components/Layout'
import Spinner from 'components/Spinner'
import Status from './Status'

import styles from './index.module.scss'

interface InvitePageProps {
	status?: number
	invite?: Invite
}

const InvitePage: NextPage<InvitePageProps> = ({
	status: initialStatus,
	invite
}) => {
	const [status, setStatus] = useState(initialStatus)
	const [isLoading, setIsLoading] = useState(status === undefined)

	const isAuthorized = Boolean(useRecoilValue(palState))
	const setAuthState = useSetRecoilState(authState)

	useEffect(() => {
		if (!(status === 401 && invite)) return

		setAuthState(state => ({
			...state,
			name: getNameFromEmail(invite.email) ?? state.name,
			email: invite.email
		}))
	}, [status, invite, setAuthState])

	useEffect(() => {
		if (!(status === 401 && invite && isAuthorized)) return

		let commit = true
		setIsLoading(true)

		acceptInvite(invite.id)
			.then(response => {
				if (!commit) return

				if (typeof response !== 'string')
					throw new HttpError(500, 'An unknown error occurred')

				Router.replace(`/${response}`)
			})
			.catch(error => {
				if (!commit) return

				setStatus(error instanceof HttpError ? error.status : 500)
				setIsLoading(false)
			})

		return () => {
			commit = false
			setIsLoading(false)
		}
	}, [status, invite, isAuthorized, setStatus, setIsLoading])

	return (
		<Layout>
			{isLoading ? (
				<Spinner className={styles.spinner} />
			) : (
				<Status status={status ?? 500} />
			)}
		</Layout>
	)
}

InvitePage.getInitialProps = async context => {
	try {
		const { invite: id } = context.query
		if (typeof id !== 'string') throw new HttpError(404, 'Invalid ID')

		const response = await acceptInvite(id, context)

		if (typeof response === 'string') {
			redirect(context, `/${response}`, false)
			return {}
		}

		return { status: 401, invite: response }
	} catch (error) {
		return { status: error instanceof HttpError ? error.status : 500 }
	}
}

export default InvitePage
