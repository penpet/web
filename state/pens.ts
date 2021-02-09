import { atom } from 'recoil'

import Pen from 'models/Pen'

const pensState = atom<Pen[]>({
	key: 'pens',
	default: []
})

export default pensState
