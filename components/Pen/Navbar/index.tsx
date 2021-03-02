import { MouseEvent, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import copy from 'copy-to-clipboard'

import Pen from 'models/Pen'
import ActivePal from 'models/ActivePal'
import usePal from 'hooks/usePal'
import { ORIGIN } from 'lib/constants'
import EditName from '../EditName'
import Options from '../Options'
import Pals from '../Pals'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'
import ActivePals from '../ActivePals'

export interface PenPageNavbarProps {
	pen: Pen
	activePals: ActivePal[] | null
}

const PenPageNavbar = ({ pen, activePals }: PenPageNavbarProps) => {
	const isAuthorized = Boolean(usePal())

	const [isLoading, setIsLoading] = useState(false)
	const [isEditingName, setIsEditingName] = useState(false)

	const copyLink = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault()

			copy(`${ORIGIN}/${pen.id}`)
			toast.dark('Copied link to clipboard')
		},
		[pen.id]
	)

	const editName = useCallback(() => {
		setIsEditingName(true)
	}, [setIsEditingName])

	return (
		<>
			<div className={styles.root}>
				{isEditingName ? (
					<EditName
						pen={pen}
						setIsShowing={setIsEditingName}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
				) : (
					<a
						className={styles.name}
						href={`/${pen.id}`}
						onClick={copyLink}
						data-balloon-pos="down"
						aria-label="Copy link"
					>
						{pen.name}
					</a>
				)}
				{isLoading ? (
					<Spinner className={styles.spinner} />
				) : isAuthorized ? (
					<Options className={styles.options} pen={pen} editName={editName} />
				) : null}
			</div>
			<ActivePals className={styles.activePals} pals={activePals} />
			<Pals className={styles.pals} pen={pen} />
		</>
	)
}

export default PenPageNavbar
