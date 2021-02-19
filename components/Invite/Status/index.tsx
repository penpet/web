import Invite from 'models/Invite'
import Auth from '../Auth'
import ErrorMessage from 'components/Error'

export interface InviteStatusProps {
	invite: Invite | number
}

const InviteStatus = ({ invite }: InviteStatusProps) => {
	if (typeof invite === 'object') return <Auth />

	switch (invite) {
		case 403:
			return <ErrorMessage>This invite was not meant for you</ErrorMessage>
		case 404:
			return <ErrorMessage>This invite is invalid</ErrorMessage>
		default:
			return <ErrorMessage>An unknown error occurred</ErrorMessage>
	}
}

export default InviteStatus
