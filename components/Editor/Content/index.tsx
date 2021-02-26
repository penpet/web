import { useRef, useState, useCallback, useEffect } from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import ShareDB, { Doc } from 'sharedb/lib/client'
import richText from 'rich-text'
import Quill, { TextChangeHandler, SelectionChangeHandler } from 'quill'
import QuillCursors from 'quill-cursors'
import QuillUploadImage from 'quill-upload-image'
import katex from 'katex'

import Pen from 'models/Pen'
import Role from 'models/Role'
import Cursors from 'models/Cursors'
import upload from 'lib/upload'
import { SOCKET_ORIGIN } from 'lib/constants'
import handleError from 'lib/handleError'
import UploadModal from 'components/Modal/Upload'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

ShareDB.types.register(richText.type)

Quill.register('modules/cursors', QuillCursors)
Quill.register('modules/uploadImage', QuillUploadImage)

export interface EditorContentProps {
	pen: Pen
}

const EditorContent = ({ pen }: EditorContentProps) => {
	const { id, role } = pen
	const readonly = role === Role.Viewer

	const toolbarRef = useRef<HTMLDivElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)

	const [isLoading, setIsLoading] = useState(true)
	const [isUploading, setIsUploading] = useState(false)

	const uploadImage = useCallback(
		async (file: File) => {
			try {
				setIsUploading(true)
				return await upload(file)
			} finally {
				setIsUploading(false)
			}
		},
		[setIsUploading]
	)

	useEffect(() => {
		if (!('katex' in window))
			((window as unknown) as Record<string, unknown>).katex = katex

		const toolbar = toolbarRef.current
		const content = contentRef.current

		if (!(toolbar && content)) return

		setIsLoading(true)

		const socket = new ReconnectingWebSocket(`${SOCKET_ORIGIN}/pens/${id}`)
		const connection = new ShareDB.Connection(socket as never)

		let doc: Doc | null = connection.get('pens', id)

		let quill: Quill | null = null
		let cursors: Cursors | null = null

		const onTextChange: TextChangeHandler = (delta, _oldDelta, source) => {
			if (!(doc && quill && cursors && source === 'user')) return

			doc.submitOp(delta, { source: quill }, error => {
				if (error) handleError(error)
			})

			const didFormat = delta.reduce(
				(format, op) => (op.insert || op.delete ? false : format),
				true
			)

			if (!didFormat) cursors.update()
		}

		const onSelectionChange: SelectionChangeHandler = (
			range,
			_oldRange,
			source
		) => {
			if (!(cursors && source === 'user')) return
			cursors.update(range)
		}

		const onOperation = (operation: unknown, source: unknown) => {
			if (!(quill && cursors) || source === quill) return

			quill.updateContents(operation as never)
			cursors.update()
		}

		doc.subscribe(error => {
			if (error) return handleError(error)
			if (!doc) return

			quill = new Quill(content, {
				readOnly: readonly,
				theme: 'snow',
				placeholder: 'Write anything!',
				modules: {
					toolbar,
					cursors: {
						autoRegisterListener: false
					},
					uploadImage: {
						upload: uploadImage,
						onError: handleError
					}
				}
			})

			quill.setContents(doc.data)
			cursors = new Cursors(id, quill)

			quill.on('text-change', onTextChange)
			quill.on('selection-change', onSelectionChange)

			doc.on('op', onOperation)

			requestAnimationFrame(() => {
				quill?.focus()
			})

			setIsLoading(false)
		})

		return () => {
			connection.close()
			cursors?.close()

			quill?.off('text-change', onTextChange)
			quill?.off('selection-change', onSelectionChange)

			doc?.off('op', onOperation)

			doc = quill = cursors = null
		}
	}, [id, readonly, toolbarRef, contentRef, uploadImage, setIsLoading])

	return (
		<div key={`${id}/${role}`} className={styles.root} aria-busy={isLoading}>
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
			<UploadModal isShowing={isUploading} setIsShowing={setIsUploading} />
		</div>
	)
}

export default EditorContent
