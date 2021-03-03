import type { DeltaOperation } from 'quill'

export interface Delta {
	ops: DeltaOperation[]
}

const getPreview = (delta: Delta) =>
	delta.ops
		.reduce(
			(text, { insert }) =>
				typeof insert === 'undefined'
					? text
					: `${text}${typeof insert === 'string' ? insert : ' '}`,
			''
		)
		.trim()
		.replace(/\s+/g, ' ')

export default getPreview
