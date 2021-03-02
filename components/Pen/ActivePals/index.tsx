import ActivePal from 'models/ActivePal'
import getInitials from 'lib/getInitials'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface ActivePalsProps {
	pals: ActivePal[] | null
}

const ActivePals = ({ pals }: ActivePalsProps) => {
	return (
		<div className={styles.root}>
			{pals?.map(pal => (
				<span
					key={pal.id}
					className={styles.pal}
					data-balloon-pos="down"
					aria-label={pal.name}
					style={{ ['--color' as never]: pal.color }}
				>
					{getInitials(pal.name)}
				</span>
			)) ?? <Spinner className={styles.spinner} />}
		</div>
	)
}

export default ActivePals
