import { useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import ShareDB from 'sharedb/lib/client'
import richText from 'rich-text'
import Quill from 'quill'

import { SOCKET_ORIGIN } from 'lib/constants'

import styles from './index.module.scss'

ShareDB.types.register(richText.type)

export interface EditorContentProps {
	penId: string | undefined
}

const EditorContent = ({ penId }: EditorContentProps) => {
	const toolbarRef = useRef<HTMLDivElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const toolbar = toolbarRef.current
		const content = contentRef.current

		if (!(penId && toolbar && content)) return

		const socket = new WebSocket(`${SOCKET_ORIGIN}/pens/${penId}`)
		const connection = new ShareDB.Connection(socket as any)

		const doc = connection.get('pens', penId)

		doc.subscribe(error => {
			if (error) return toast.error(error.message)

			const quill = new Quill(content, {
				theme: 'snow',
				modules: { toolbar }
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
	}, [penId, toolbarRef, contentRef])

	return (
		<div className={styles.root}>
			<div ref={toolbarRef}>
				<span className="ql-formats">
					<select className="ql-size" />
				</span>
				<span className="ql-formats">
					<button className="ql-bold" />
					<button className="ql-italic" />
					<button className="ql-underline" />
					<button className="ql-strike" />
				</span>
				<span className="ql-formats">
					<select className="ql-color" />
					<select className="ql-background" />
				</span>
				<span className="ql-formats">
					<button className="ql-script" value="sub" />
					<button className="ql-script" value="super" />
				</span>
				<span className="ql-formats">
					<button className="ql-header" value="1" />
					<button className="ql-header" value="2" />
					<button className="ql-blockquote" />
					<button className="ql-code-block" />
				</span>
				<span className="ql-formats">
					<button className="ql-list" value="ordered" />
					<button className="ql-list" value="bullet" />
					<button className="ql-indent" value="-1" />
					<button className="ql-indent" value="+1" />
				</span>
				<span className="ql-formats">
					<button className="ql-direction" value="rtl" />
					<select className="ql-align" />
				</span>
				<span className="ql-formats">
					<button className="ql-link" />
					<button className="ql-image" />
					<button className="ql-video" />
					<button className="ql-formula" />
				</span>
				<span className="ql-formats">
					<button className="ql-clean" />
				</span>
			</div>
			<div ref={contentRef} />
		</div>
	)
}

export default EditorContent
