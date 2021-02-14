import { NextPageContext } from 'next'

import getPal from './getPal'
import getPens from './getPens'
import { InitialState } from 'state'

const getInitialState = async (
	context: NextPageContext
): Promise<InitialState> => {
	try {
		const pal = await getPal(context)

		return {
			pal,
			pens: pal ? await getPens(context) : []
		}
	} catch {
		return { pal: null, pens: [] }
	}
}

export default getInitialState
