import {
	FormEvent,
	ChangeEvent,
	useRef,
	useState,
	useCallback,
	useEffect
} from 'react'
import { mutate } from 'swr'

import Pal from 'models/Pal'
import editPalName from 'lib/editPalName'
import handleError from 'lib/handleError'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface ProfileEditNameProps {
	pal: Pal
	isShowing: boolean
}

const ProfileEditName = ({ pal, isShowing }: ProfileEditNameProps) => {
	const input = useRef<HTMLInputElement | null>(null)

	const currentName = pal.name
	const [name, setName] = useState(currentName)

	const [isLoading, setIsLoading] = useState(false)

	const edit = useCallback(async () => {
		if (!name || name === currentName || isLoading) return

		try {
			setIsLoading(true)
			await editPalName(name)

			mutate('auth', (pal: Pal | null | undefined) => pal && { ...pal, name })
		} catch (error) {
			input.current?.focus()
			handleError(error)
		} finally {
			setIsLoading(false)
		}
	}, [input, currentName, name, isLoading, setName, setIsLoading])

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
		<form onSubmit={onSubmit}>
			<div className={styles.header}>
				<label className={styles.title} htmlFor="profile-dropdown-name-input">
					name
				</label>
				{isLoading && <Spinner className={styles.spinner} />}
			</div>
			<input
				ref={input}
				id="profile-dropdown-name-input"
				className={styles.input}
				type="name"
				autoComplete={isShowing ? 'name' : 'off'}
				placeholder={currentName}
				disabled={isLoading}
				value={name}
				onChange={onChange}
				onBlur={edit}
			/>
		</form>
	)
}

export default ProfileEditName
