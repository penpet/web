import type { DeltaOperation } from 'quill'

import truncate from '../utils/truncate'

export interface Delta {
	ops: DeltaOperation[]
}

const MAX_LENGTH = 350

const getPreview = (delta: Delta) => {
	const text = delta.ops
		.reduce(
			(text, { insert }) =>
				typeof insert === 'undefined'
					? text
					: `${text}${typeof insert === 'string' ? insert : ' '}`,
			''
		)
		.trim()
		.replace(/\s+/g, ' ')

	return truncate(text, MAX_LENGTH)
}

export default getPreview
