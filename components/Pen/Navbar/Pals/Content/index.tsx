import usePals from 'hooks/usePals'
import Pen from 'models/Pen'

import styles from './index.module.scss'

export interface PenPagePalsContentProps {
	pen: Pen
	isShowing: boolean
}

const PenPagePalsContent = ({ pen, isShowing }: PenPagePalsContentProps) => {
	const pals = usePals(pen.id, isShowing)

	return (
		<>
			{pals
				? pals.map(pal => (
						<p key={pal.id}>
							{pal.name}: {pal.role}
						</p>
				  ))
				: 'Loading...'}
		</>
	)
}

export default PenPagePalsContent
export const contentClassName = styles.root
