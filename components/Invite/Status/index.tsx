import Auth from '../Auth'
import ErrorMessage from 'components/Error'

export interface InviteStatusProps {
	status: number
}

const InviteStatus = ({ status }: InviteStatusProps) => {
	switch (status) {
		case 401:
			return <Auth />
		case 403:
			return <ErrorMessage>This invite was not meant for you</ErrorMessage>
		case 404:
			return <ErrorMessage>This invite is invalid</ErrorMessage>
		default:
			return <ErrorMessage>An unknown error occurred</ErrorMessage>
	}
}

export default InviteStatus
