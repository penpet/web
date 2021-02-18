import { atom } from 'recoil'

export interface AuthState {
	name: string
	email: string
	password: string
}

const authState = atom<AuthState>({
	key: 'auth',
	default: { name: '', email: '', password: '' }
})

export default authState
