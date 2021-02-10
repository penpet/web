import { MutableSnapshot } from 'recoil'

import Pal from 'models/Pal'
import { PenData, penFromData } from 'models/Pen'
import sortPens from 'lib/sortPens'
import palState from './pal'
import pensState from './pens'

export interface InitialState {
	pal: Pal | null
	pens: PenData[]
}

const initializeState = (state: InitialState) => (
	snapshot: MutableSnapshot
) => {
	snapshot.set(palState, state.pal)
	snapshot.set(pensState, sortPens(state.pens.map(penFromData)))
}

export default initializeState
