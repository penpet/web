import { useState } from 'react'
import cx from 'classnames'

import Pen from 'models/Pen'
import Dropdown from 'components/Dropdown'
import Trigger, { triggerClassName } from './Trigger'
import Content, { contentClassName } from './Content'

import styles from './index.module.scss'

export interface PenOptionsProps {
	className?: string
	pen: Pen
	editName(): void
}

const PenOptions = ({ className, pen, editName }: PenOptionsProps) => {
	const [isShowing, setIsShowing] = useState(false)

	return (
		<Dropdown
			className={cx(styles.root, className)}
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
