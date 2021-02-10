import { useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import ShareDB from 'sharedb/lib/client'
import richText from 'rich-text'
import Quill from 'quill'

import { SOCKET_ORIGIN } from 'lib/constants'

import 'quill/dist/quill.bubble.css'

ShareDB.types.register(richText.type)

export interface EditorContentProps {
	penId: string | undefined
}

const EditorContent = ({ penId }: EditorContentProps) => {
	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const element = ref.current
		if (!(penId && element)) return

		const socket = new WebSocket(`${SOCKET_ORIGIN}/pens/${penId}`)
		const connection = new ShareDB.Connection(socket as any)

		const doc = connection.get('pens', penId)

		doc.subscribe(error => {
			if (error) return toast.error(error.message)

			const quill = new Quill(element, {
				theme: 'bubble',
				modules: {
					toolbar: ['bold', 'italic', 'underline', 'strike', 'align']
				}
			})

			quill.setContents(doc.data)

			quill.on('text-change', (delta, _oldDelta, source) => {
				if (source !== 'user') return
				doc.submitOp(delta, { source: quill })
			})

			doc.on('op', (op, source) => {
				if (source === quill) return
				quill.updateContents(op as any)
			})
		})

		return () => connection.close()
	}, [penId, ref])

	return <div ref={ref} />
}

export default EditorContent
