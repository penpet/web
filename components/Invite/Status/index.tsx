import Invite from 'models/Invite'
import Auth from '../Auth'
import Head from 'components/Head'
import ErrorMessage from 'components/Error'

export interface InviteStatusProps {
	invite: Invite | number
}

const InviteStatus = ({ invite }: InviteStatusProps) => {
	if (typeof invite === 'object') return <Auth invite={invite} />

	switch (invite) {
		case 403:
			return (
				<>
					<Head
						title="Unauthorized | penpet"
						description="This invite was not meant for you"
					/>
					<ErrorMessage>This invite was not meant for you</ErrorMessage>
				</>
			)
		case 404:
			return (
				<>
					<Head
						title="Invalid invite | penpet"
						description="This invite does not exist or has already been used"
					/>
					<ErrorMessage>This invite is invalid</ErrorMessage>
				</>
			)
		default:
			return (
				<>
					<Head
						title={`Error (${invite}) | penpet`}
						description={`An unknown error occurred (${invite})`}
					/>
					<ErrorMessage>An unknown error occurred ({invite})</ErrorMessage>
				</>
			)
	}
}

export default InviteStatus
