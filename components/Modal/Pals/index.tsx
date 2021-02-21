import Pen from 'models/Pen'
import Role from 'models/Role'
import usePals from 'hooks/usePals'
import Header from './Header'
import Invite from './Invite'
import Row from './Pal'
import Link from './Link'
import Modal, { ModalProps } from '..'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface PalsModalProps extends ModalProps {
	pen: Pen
}

const PalsModal = ({ pen, isShowing, setIsShowing }: PalsModalProps) => {
	const pals = usePals(pen.id, isShowing)
	const isOwner = pen.role === Role.Owner

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<Header setIsShowing={setIsShowing} />
			<div className={styles.content}>
				{pals ? (
					<>
						{isOwner && <Invite pen={pen} />}
						<div className={styles.pals}>
							{pals.map(pal => (
								<Row key={pal.id} pal={pal} pen={pen} />
							))}
						</div>
					</>
				) : (
					<Spinner className={styles.spinner} />
				)}
			</div>
			<Link pen={pen} />
		</Modal>
	)
}

export default PalsModal
