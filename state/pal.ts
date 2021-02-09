import { atom } from 'recoil'

import Pal from 'models/Pal'

const palState = atom<Pal | null>({
	key: 'pal',
	default: null
})

export default palState
