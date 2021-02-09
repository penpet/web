import { NextPageContext } from 'next'

import getPal from './getPal'
import getPens from './getPens'
import { InitialState } from 'state'

const getInitialState = async (
	context: NextPageContext
): Promise<InitialState> => {
	const pal = await getPal(context)

	return {
		pal,
		pens: pal ? await getPens(context) : []
	}
}

export default getInitialState
