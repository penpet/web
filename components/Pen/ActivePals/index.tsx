import cx from 'classnames'

import ActivePal from 'models/ActivePal'
import getInitials from 'lib/getInitials'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface ActivePalsProps {
	className?: string
	pals: ActivePal[] | null
}

const ActivePals = ({ className, pals }: ActivePalsProps) => {
	return (
		<div className={cx(styles.root, className)}>
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
