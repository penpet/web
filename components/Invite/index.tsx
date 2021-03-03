import { useState, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { NextPage } from 'next'
import Router from 'next/router'

import Invite from 'models/Invite'
import HttpError from 'models/HttpError'
import acceptInvite from 'lib/acceptInvite'
import redirect from 'lib/redirect'
import getNameFromEmail from 'lib/getNameFromEmail'
import authState from 'state/auth'
import usePal from 'hooks/usePal'
import Layout from 'components/Layout'
import Head from 'components/Head'
import Spinner from 'components/Spinner'
import Status from './Status'

import styles from './index.module.scss'

interface InvitePageProps {
	invite?: Invite | number
}

const InvitePage: NextPage<InvitePageProps> = ({ invite: initialInvite }) => {
	const [invite, setInvite] = useState(initialInvite)
	const [isLoading, setIsLoading] = useState(invite === undefined)

	const isAuthorized = Boolean(usePal())
	const setAuthState = useSetRecoilState(authState)

	useEffect(() => {
		if (typeof invite !== 'object') return

		setAuthState(state => ({
			...state,
			name: getNameFromEmail(invite.email) ?? state.name,
			email: invite.email
		}))
	}, [invite, setAuthState])

	useEffect(() => {
		if (!(typeof invite === 'object' && isAuthorized)) return

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

				setInvite(error instanceof HttpError ? error.status : 500)
				setIsLoading(false)
			})

		return () => {
			commit = false
			setIsLoading(false)
		}
	}, [invite, isAuthorized, setInvite, setIsLoading])

	return (
		<Layout>
			{isLoading ? (
				<>
					<Head
						title="Inviting... | penpet"
						description="You're being invited to the pen"
					/>
					<Spinner className={styles.spinner} />
				</>
			) : (
				<Status invite={invite ?? 500} />
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

		return { invite: response }
	} catch (error) {
		return { invite: error instanceof HttpError ? error.status : 500 }
	}
}

export default InvitePage
