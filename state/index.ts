import { MutableSnapshot } from 'recoil'

import Pal from 'models/Pal'
import palState from './pal'

export type StateProps = Record<string, unknown>

const initializeState = (props: StateProps) => (state: MutableSnapshot) => {
	state.set(palState, props.pal as Pal | null)
}

export default initializeState
