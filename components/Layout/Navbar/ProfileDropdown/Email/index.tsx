import Pal from 'models/Pal'

import styles from './index.module.scss'

export interface ProfileEmailProps {
	pal: Pal
}

const ProfileEmail = ({ pal }: ProfileEmailProps) => (
	<div className={styles.root}>
		<label className={styles.title} htmlFor="profile-dropdown-email-input">
			email
		</label>
		<input
			id="profile-dropdown-email-input"
			className={styles.value}
			readOnly
			type="email"
			value={pal.email}
		/>
	</div>
)

export default ProfileEmail
