import { useRef, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ShareDB, { Doc } from 'sharedb/lib/client'
import richText from 'rich-text'
import Quill, { TextChangeHandler } from 'quill'
import { ImageDrop } from 'quill-image-drop-module'

import { SOCKET_ORIGIN } from 'lib/constants'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

ShareDB.types.register(richText.type)
Quill.register('modules/imageDrop', ImageDrop)

export interface EditorContentProps {
	penId: string | undefined
}

const EditorContent = ({ penId }: EditorContentProps) => {
	const [isLoading, setIsLoading] = useState(true)

	const toolbarRef = useRef<HTMLDivElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const toolbar = toolbarRef.current
		const content = contentRef.current

		if (!(penId && toolbar && content)) return

		setIsLoading(true)

		const socket = new WebSocket(`${SOCKET_ORIGIN}/pens/${penId}`)
		const connection = new ShareDB.Connection(socket as never)

		let doc: Doc | null = connection.get('pens', penId)
		let quill: Quill | null = null

		const onTextChange: TextChangeHandler = (delta, _oldDelta, source) => {
			if (!doc || source !== 'user') return
			doc.submitOp(delta, { source: quill })
		}

		const onOperation = (operation: unknown, source: unknown) => {
			if (!quill || source === quill) return
			quill.updateContents(operation as never)
		}

		doc.subscribe(error => {
			if (error) return toast.error(error.message)
			if (!doc) return

			quill = new Quill(content, {
				theme: 'snow',
				modules: { toolbar, imageDrop: true }
			})

			quill.setContents(doc.data)

			quill.on('text-change', onTextChange)
			doc.on('op', onOperation)

			setIsLoading(false)
		})

		return () => {
			connection.close()

			doc?.off('op', onOperation)
			quill?.off('text-change', onTextChange)

			doc = quill = null
		}
	}, [penId, toolbarRef, contentRef, setIsLoading])

	return (
		<div key={penId} className={styles.root} aria-busy={isLoading}>
			<div className={styles.toolbar} ref={toolbarRef}>
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
					<button className="ql-code" />
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
			<div className={styles.content} ref={contentRef} />
			{isLoading && <Spinner className={styles.spinner} />}
		</div>
	)
}

export default EditorContent
