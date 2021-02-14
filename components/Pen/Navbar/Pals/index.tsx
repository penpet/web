import { useState } from 'react'

import Pen from 'models/Pen'
import Dropdown from 'components/Dropdown'
import Trigger, { triggerClassName } from './Trigger'
import Content, { contentClassName } from './Content'

import styles from './index.module.scss'

export interface PenPagePalsProps {
	pen: Pen
}

const PenPagePals = ({ pen }: PenPagePalsProps) => {
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
			<Content pen={pen} />
		</Dropdown>
	)
}

export default PenPagePals
