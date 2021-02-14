import Pen from 'models/Pen'
import usePals from 'hooks/usePals'
import Row from './Pal'
import { ModalProps } from '..'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface PalsModalProps extends ModalProps {
	pen: Pen
}

const PalsModal = ({ pen, isShowing }: PalsModalProps) => {
	const pals = usePals(pen.id, isShowing)

	return (
		<>
			{/* {pals ? (
				pals.map(pal => <Row key={pal.id} pal={pal} pen={pen} />)
			) : (
				<Spinner className={styles.spinner} />
			)} */}
		</>
	)
}

export default PalsModal
