import { MouseEvent, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import copy from 'copy-to-clipboard'

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

	const copyName = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault()

			copy(pen.name)
			toast.dark('Copied link to clipboard')
		},
		[pen.name]
	)

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
					<a
						className={styles.name}
						href={`/${pen.id}`}
						onClick={copyName}
						data-balloon-pos="down"
						aria-label="Copy link"
					>
						{pen.name}
					</a>
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
