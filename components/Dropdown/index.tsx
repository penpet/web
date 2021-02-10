import { ReactNode, useRef, useCallback, useEffect } from 'react'
import cx from 'classnames'

import styles from './index.module.scss'

export interface DropdownProps {
	className?: string
	triggerClassName?: string
	contentClassName?: string
	trigger: ReactNode
	isShowing: boolean
	setIsShowing(isShowing: boolean): void
	children?: ReactNode
}

const Dropdown = ({
	isShowing,
	setIsShowing,
	className,
	triggerClassName,
	contentClassName,
	trigger,
	children
}: DropdownProps) => {
	const triggerRef = useRef<HTMLButtonElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)

	const onClick = useCallback(
		(event: MouseEvent) => {
			const trigger = triggerRef.current
			const content = contentRef.current

			if (!(trigger && content)) return
			const target = event.target as Node | null

			if (trigger === target || trigger.contains(target))
				return setIsShowing(true)

			if (content === target || content.contains(target)) return
			setIsShowing(false)
		},
		[triggerRef, contentRef, setIsShowing]
	)

	useEffect(() => {
		const { body } = document

		body.addEventListener('click', onClick)
		return () => body.removeEventListener('click', onClick)
	}, [onClick])

	return (
		<div className={cx(styles.root, className)}>
			<button className={cx(styles.trigger, triggerClassName)} ref={triggerRef}>
				{trigger}
			</button>
			<div className={styles.container} aria-hidden={!isShowing}>
				<div className={cx(styles.content, contentClassName)} ref={contentRef}>
					{children}
				</div>
			</div>
		</div>
	)
}

export default Dropdown
