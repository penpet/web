import { ReactNode, useRef, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'

import styles from './index.module.scss'

export interface IsModalShowingProps {
	isShowing: boolean
	setIsShowing(isShowing: boolean): void
}

export interface ModalProps extends IsModalShowingProps {
	className?: string
	children?: ReactNode
}

const Modal = ({
	className,
	isShowing,
	setIsShowing,
	children
}: ModalProps) => {
	const [root, setRoot] = useState<HTMLDivElement | null>(null)
	const content = useRef<HTMLDivElement | null>(null)

	const onClick = useCallback(
		({ target }: MouseEvent) => {
			const { current } = content

			if (current && !(target === current || current.contains(target as Node)))
				setIsShowing(false)
		},
		[content, setIsShowing]
	)

	useEffect(() => {
		if (root) return
		setRoot(document.createElement('div'))
	}, [root, setRoot])

	useEffect(() => {
		if (!root) return

		root.classList.add(styles.root)
		root.setAttribute('role', 'presentation')

		const { body } = document
		body.appendChild(root)

		return () => {
			body.removeChild(root)
		}
	}, [root])

	useEffect(() => {
		if (!root) return
		root.setAttribute('aria-hidden', (!isShowing).toString())

		if (!isShowing) return
		const { body } = document

		body.addEventListener('click', onClick)

		return () => {
			body.removeEventListener('click', onClick)
		}
	}, [root, isShowing, onClick])

	return (
		root &&
		createPortal(
			<div className={cx(styles.content, className)} ref={content}>
				{children}
			</div>,
			root
		)
	)
}

export default Modal
