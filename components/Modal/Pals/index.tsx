import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import Pen from 'models/Pen'
import Role from 'models/Role'
import usePals from 'hooks/usePals'
import Invite from './Invite'
import Row from './Pal'
import Modal, { ModalProps } from '..'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface PalsModalProps extends ModalProps {
	pen: Pen
}

const PalsModal = ({ pen, isShowing, setIsShowing }: PalsModalProps) => {
	const pals = usePals(pen.id, isShowing)
	const isOwner = pen.role === Role.Owner

	const hide = useCallback(() => {
		setIsShowing(false)
	}, [setIsShowing])

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<header className={styles.header}>
				<h3 className={styles.title}>my pals</h3>
				<button className={styles.hide} onClick={hide}>
					<FontAwesomeIcon icon={faTimesCircle} />
				</button>
			</header>
			<div className={styles.content}>
				{pals ? (
					<>
						{isOwner && <Invite pen={pen} />}
						{pals.map(pal => (
							<Row key={pal.id} pal={pal} pen={pen} />
						))}
					</>
				) : (
					<Spinner className={styles.spinner} />
				)}
			</div>
		</Modal>
	)
}

export default PalsModal
