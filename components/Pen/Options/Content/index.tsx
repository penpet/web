import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import Pen from 'models/Pen'

export interface PenOptionsContentProps {
	pen: Pen
	editName(): void
	setIsShowing(isShowing: boolean): void
}

const PenOptionsContent = ({
	pen,
	editName: _editName,
	setIsShowing
}: PenOptionsContentProps) => {
	const editName = useCallback(() => {
		_editName()
		setIsShowing(false)
	}, [_editName, setIsShowing])

	return (
		<>
			<button onClick={editName}>
				<FontAwesomeIcon icon={faEdit} />
			</button>
		</>
	)
}

export default PenOptionsContent
