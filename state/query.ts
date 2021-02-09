import { atom } from 'recoil'

const queryState = atom<string>({
	key: 'query',
	default: ''
})

export default queryState
