import { ChangeEvent, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import queryState from 'state/query'

import styles from './index.module.scss'

const SidebarSearch = () => {
	const [query, setQuery] = useRecoilState(queryState)

	const onQueryChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setQuery(event.target.value)
		},
		[setQuery]
	)

	return (
		<div className={styles.root}>
			<input
				className={styles.input}
				placeholder="search"
				value={query}
				onChange={onQueryChange}
			/>
			<FontAwesomeIcon className={styles.icon} icon={faSearch} />
		</div>
	)
}

export default SidebarSearch
