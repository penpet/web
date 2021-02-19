import { useState, useCallback } from 'react'

import Pen from 'models/Pen'
import EditName from '../EditName'
import Options from '../Options'
import Pals from '../Pals'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface PenPageNavbarProps {
	pen: Pen
}

const PenPageNavbar = ({ pen }: PenPageNavbarProps) => {
	const [isLoading, setIsLoading] = useState(false)
	const [isEditingName, setIsEditingName] = useState(false)

	const editName = useCallback(() => {
		setIsEditingName(true)
	}, [setIsEditingName])

	return (
		<>
			<div className={styles.root}>
				{isEditingName ? (
					<EditName
						className={styles.editName}
						pen={pen}
						setIsShowing={setIsEditingName}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
				) : (
					<p className={styles.name}>{pen.name}</p>
				)}
				{isLoading ? (
					<Spinner className={styles.spinner} />
				) : (
					<Options pen={pen} editName={editName} />
				)}
			</div>
			<Pals pen={pen} />
		</>
	)
}

export default PenPageNavbar
