import { atom } from 'recoil'

export const logInModalState = atom<boolean>({
	key: 'logInModal',
	default: false
})

export const signUpModalState = atom<boolean>({
	key: 'signUpModal',
	default: false
})
