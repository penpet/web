import Pal from 'models/Pal'
import { atom } from 'recoil'

const palState = atom<Pal | null>({
	key: 'pal',
	default: null
})

export default palState
