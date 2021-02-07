import { useState } from 'react'
import { NextPage } from 'next'

import { API_ORIGIN } from 'lib/constants'

const Home: NextPage = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	return (
		<>
			<form
				onSubmit={event => {
					event.preventDefault()
					fetch(`${API_ORIGIN}/auth/sign-up`, {
						method: 'POST',
						credentials: 'include',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ name, email, password })
					})
				}}
			>
				<label htmlFor="sign-up-name">Name</label>
				<input
					id="sign-up-name"
					autoComplete="name"
					value={name}
					onChange={event => setName(event.target.value)}
				/>
				<label htmlFor="sign-up-email">Email</label>
				<input
					id="sign-up-email"
					type="email"
					autoComplete="email"
					value={email}
					onChange={event => setEmail(event.target.value)}
				/>
				<label htmlFor="sign-up-password">Password</label>
				<input
					id="sign-up-password"
					type="password"
					autoComplete="new-password"
					value={password}
					onChange={event => setPassword(event.target.value)}
				/>
				<button disabled={!(name && email && password)}>Sign up</button>
			</form>
			<form
				onSubmit={event => {
					event.preventDefault()
					fetch(`${API_ORIGIN}/auth/log-in`, {
						method: 'POST',
						credentials: 'include',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ email, password })
					})
				}}
			>
				<label htmlFor="log-in-email">Email</label>
				<input
					id="log-in-email"
					type="email"
					autoComplete="email"
					value={email}
					onChange={event => setEmail(event.target.value)}
				/>
				<label htmlFor="log-in-password">Password</label>
				<input
					id="log-in-password"
					type="password"
					autoComplete="current-password"
					value={password}
					onChange={event => setPassword(event.target.value)}
				/>
				<button disabled={!(email && password)}>Log in</button>
			</form>
			<style jsx>{`
				form {
					display: inline-block;
					vertical-align: top;
				}

				label,
				input,
				button {
					display: block;
				}
			`}</style>
		</>
	)
}

export default Home
