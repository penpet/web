import Pal from 'models/Pal'

export interface ProfileEmailProps {
	pal: Pal
}

const ProfileEmail = ({ pal }: ProfileEmailProps) => (
	<>
		<label>email</label>
		<p>{pal.email}</p>
	</>
)

export default ProfileEmail
