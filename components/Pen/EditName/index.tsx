import {
	FormEvent,
	ChangeEvent,
	useRef,
	useState,
	useCallback,
	useEffect
} from 'react'
import cx from 'classnames'

import Pen from 'models/Pen'
import editPenName from 'lib/editPenName'
import handleError from 'lib/handleError'

import styles from './index.module.scss'

export interface PenEditNameProps {
	className?: string
	pen: Pen
	setIsShowing(isShowing: boolean): void
	isLoading: boolean
	setIsLoading(isLoading: boolean): void
}

const PenEditName = ({
	className,
	pen,
	setIsShowing,
	isLoading,
	setIsLoading
}: PenEditNameProps) => {
	const input = useRef<HTMLInputElement | null>(null)
	const [name, setName] = useState(pen.name)

	const { id, name: currentName } = pen

	const edit = useCallback(async () => {
		if (isLoading) return
		if (!name || name === currentName) return setIsShowing(false)

		try {
			setIsLoading(true)
			await editPenName(id, name)

			setIsShowing(false)
		} catch (error) {
			input.current?.focus()
			handleError(error)
		} finally {
			setIsLoading(false)
		}
	}, [
		input,
		id,
		currentName,
		name,
		isLoading,
		setName,
		setIsShowing,
		setIsLoading
	])

	const onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			input.current?.blur()
		},
		[input]
	)

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setName(event.target.value)
		},
		[setName]
	)

	useEffect(() => {
		input.current?.focus()
	}, [input])

	return (
		<form className={cx(styles.root, className)} onSubmit={onSubmit}>
			<input
				ref={input}
				className={styles.input}
				placeholder={pen.name}
				disabled={isLoading}
				value={name}
				onChange={onChange}
				onBlur={edit}
			/>
		</form>
	)
}

export default PenEditName
