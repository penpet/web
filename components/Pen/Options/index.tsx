import { useState } from 'react'

import Pen from 'models/Pen'
import Dropdown from 'components/Dropdown'
import Trigger, { triggerClassName } from './Trigger'
import Content, { contentClassName } from './Content'

import styles from './index.module.scss'

export interface PenOptionsProps {
	pen: Pen
	editName(): void
}

const PenOptions = ({ pen, editName }: PenOptionsProps) => {
	const [isShowing, setIsShowing] = useState(false)

	return (
		<Dropdown
			className={styles.root}
			triggerClassName={triggerClassName}
			contentClassName={contentClassName}
			trigger={<Trigger />}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<Content pen={pen} editName={editName} setIsShowing={setIsShowing} />
		</Dropdown>
	)
}

export default PenOptions
